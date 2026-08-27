import { GeminiExtractionService } from "./gemini.service";
import { Assessment } from "../types";
import { updateAssessment } from "../store";

export type ExtractionPipeline = { fullExtraction: (questionPaperPath: string, answerSheetPath: string, onStatusChange: (status: string) => void) => Promise<{ questions: Assessment["questions"]; answers: Assessment["answers"]; mappings: Assessment["mappings"]; totalPages: number; }>; };

export function getExtractionService(): ExtractionPipeline {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured. Add it to backend/.env before processing uploads.");
  return new GeminiExtractionService(apiKey);
}

export async function runExtraction(assessmentId: string, assessment: Assessment): Promise<void> {
  try {
    const result = await getExtractionService().fullExtraction(assessment.questionPaperPath!, assessment.answerSheetPath!, (status) => updateAssessment(assessmentId, { status: status as Assessment["status"] }));
    updateAssessment(assessmentId, { questions: result.questions, answers: result.answers, mappings: result.mappings, totalPages: result.totalPages, status: "completed" });
  } catch (error: any) {
    console.error("Extraction error:", error);
    updateAssessment(assessmentId, { status: "error", error: error.message || "Extraction failed" });
  }
}
