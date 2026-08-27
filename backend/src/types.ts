export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Question {
  id: string;
  text: string;
  marks?: number;
  order: number;
  subQuestion?: string; // e.g. "a", "b" for 11(a), 11(b)
  parentNumber?: string; // e.g. "11" for 11(a)
  displayNumber: string; // e.g. "11(a)" or "3"
}

export interface Answer {
  id: string;
  questionId?: string;
  text: string;
  page: number;
  regions: Region[];
  confidence: number;
  pages?: number[]; // for multi-page answers
  questionRef?: string; // label detected beside a handwritten answer
}

export interface Mapping {
  questionId: string;
  answerId?: string;
  status: "matched" | "unanswered" | "needs_review";
  confidence?: number;
}

export type AssessmentStatus =
  | "uploaded"
  | "extracting_questions"
  | "extracting_answers"
  | "detecting_regions"
  | "mapping_answers"
  | "completed"
  | "error";

export interface Assessment {
  id: string;
  status: AssessmentStatus;
  questionPaperPath?: string;
  answerSheetPath?: string;
  questionPaperName?: string;
  answerSheetName?: string;
  questions: Question[];
  answers: Answer[];
  mappings: Mapping[];
  totalPages: number;
  createdAt: string;
  error?: string;
}

export interface ExtractionService {
  extractQuestions(filePath: string): Promise<Question[]>;
  extractAnswers(filePath: string): Promise<Answer[]>;
  mapAnswers(questions: Question[], answers: Answer[]): Promise<Mapping[]>;
}
