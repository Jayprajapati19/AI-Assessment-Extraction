import { GoogleGenAI } from "@google/genai";
import { v4 as uuid } from "uuid";
import * as fs from "fs";
import * as path from "path";
import { Answer, ExtractionService, Mapping, Question, Region } from "../types";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const mimeTypes: Record<string, string> = { ".pdf": "application/pdf", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png" };
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const number = (value: unknown, fallback: number, min: number, max: number) => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
};

function jsonArray(response: string | undefined, kind: string): unknown[] {
  if (!response) throw new Error(`Gemini returned no ${kind} data.`);
  try { const data = JSON.parse(response); if (Array.isArray(data)) return data; } catch { /* handled below */ }
  throw new Error(`Gemini returned invalid ${kind} data. Please try the upload again.`);
}

export class GeminiExtractionService implements ExtractionService {
  private ai: GoogleGenAI;
  constructor(apiKey: string) { this.ai = new GoogleGenAI({ apiKey }); }

  private documentPart(filePath: string) {
    const mimeType = mimeTypes[path.extname(filePath).toLowerCase()];
    if (!mimeType) throw new Error("Only PDF, JPG, JPEG, and PNG files are supported.");
    return { inlineData: { mimeType, data: fs.readFileSync(filePath).toString("base64") } };
  }

  private async documentJson(filePath: string, prompt: string, kind: string) {
    const response = await this.ai.models.generateContent({ model: MODEL, contents: [{ text: prompt }, this.documentPart(filePath)], config: { responseMimeType: "application/json", temperature: 0 } });
    return jsonArray(response.text, kind);
  }

  async extractQuestions(filePath: string): Promise<Question[]> {
    const rows = await this.documentJson(filePath, "Extract every printed assessment question in visual order. Do not invent questions. Return JSON array items with text, marks (number or null), order, displayNumber, subQuestion (string or null), parentNumber (string or null). Preserve the wording visible in the document.", "question");
    const questions = rows.map((row, index) => {
      const item = (row || {}) as Record<string, unknown>;
      return { id: uuid(), text: text(item.text), marks: typeof item.marks === "number" && item.marks >= 0 ? item.marks : undefined, order: number(item.order, index + 1, 1, 10000), displayNumber: text(item.displayNumber) || String(index + 1), subQuestion: text(item.subQuestion) || undefined, parentNumber: text(item.parentNumber) || undefined };
    }).filter((question) => question.text);
    if (!questions.length) throw new Error("No questions could be read from the uploaded question paper.");
    return questions;
  }

  async extractAnswers(filePath: string): Promise<Answer[]> {
    const rows = await this.documentJson(filePath, "Transcribe every distinct handwritten answer visible on this answer sheet. Do not invent answers. Return JSON array items with text, page (1-indexed), pages (array of 1-indexed page numbers), questionRef (written question label or null), confidence (0-1), and regions. regions is an array of tight handwriting bounding boxes on the first page, each with x, y, width, height as 0-1 fractions.", "answer");
    return rows.map((row) => {
      const item = (row || {}) as Record<string, unknown>; const page = Math.round(number(item.page, 1, 1, 10000));
      const pages = Array.isArray(item.pages) ? item.pages.map((value) => Math.round(number(value, page, 1, 10000))) : [page];
      const regions = (Array.isArray(item.regions) ? item.regions : []).map((value): Region => { const region = (value || {}) as Record<string, unknown>; const x = number(region.x, 0, 0, 1); const y = number(region.y, 0, 0, 1); return { x, y, width: number(region.width, 1 - x, .01, 1 - x), height: number(region.height, .1, .01, 1 - y) }; });
      return { id: uuid(), text: text(item.text), page, pages: [...new Set(pages)], regions, confidence: number(item.confidence, .5, 0, 1), questionRef: text(item.questionRef) || undefined };
    }).filter((answer) => answer.text);
  }

  async mapAnswers(questions: Question[], answers: Answer[]): Promise<Mapping[]> {
    if (!answers.length) return questions.map((question) => ({ questionId: question.id, status: "unanswered" as const }));
    const response = await this.ai.models.generateContent({ model: MODEL, contents: `Match each answer to at most one question. Prefer the handwritten questionRef, then content. Do not match uncertain answers. Return JSON with exactly one item per question: questionId, answerId (or null), status (matched, needs_review, unanswered), confidence (0-1). Questions: ${JSON.stringify(questions.map(({ id, displayNumber, text }) => ({ id, displayNumber, text })))} Answers: ${JSON.stringify(answers.map(({ id, text, questionRef }) => ({ id, text, questionRef })))}.`, config: { responseMimeType: "application/json", temperature: 0 } });
    const rows = jsonArray(response.text, "mapping"); const questionIds = new Set(questions.map((q) => q.id)); const answerIds = new Set(answers.map((a) => a.id)); const seenQuestions = new Set<string>(); const seenAnswers = new Set<string>(); const mappings: Mapping[] = [];
    for (const row of rows) { const item = (row || {}) as Record<string, unknown>; const questionId = text(item.questionId); const answerId = text(item.answerId); if (!questionIds.has(questionId) || seenQuestions.has(questionId)) continue; seenQuestions.add(questionId); const validAnswer = answerIds.has(answerId) && !seenAnswers.has(answerId); if (validAnswer) seenAnswers.add(answerId); const confidence = number(item.confidence, 0, 0, 1); mappings.push({ questionId, answerId: validAnswer ? answerId : undefined, status: validAnswer ? (text(item.status) === "matched" && confidence >= .7 ? "matched" : "needs_review") : "unanswered", confidence: validAnswer ? confidence : undefined }); }
    for (const question of questions) if (!seenQuestions.has(question.id)) mappings.push({ questionId: question.id, status: "unanswered" });
    return mappings;
  }

  async fullExtraction(questionPaperPath: string, answerSheetPath: string, onStatusChange: (status: string) => void) {
    onStatusChange("extracting_questions"); const questions = await this.extractQuestions(questionPaperPath); onStatusChange("extracting_answers"); const answers = await this.extractAnswers(answerSheetPath); onStatusChange("detecting_regions"); onStatusChange("mapping_answers"); const mappings = await this.mapAnswers(questions, answers);
    for (const mapping of mappings) { const answer = answers.find((item) => item.id === mapping.answerId); if (answer) answer.questionId = mapping.questionId; }
    return { questions, answers, mappings, totalPages: Math.max(1, ...answers.flatMap((answer) => answer.pages || [answer.page])) };
  }
}
