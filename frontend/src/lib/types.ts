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
  subQuestion?: string;
  parentNumber?: string;
  displayNumber: string;
}

export interface Answer {
  id: string;
  questionId?: string;
  text: string;
  page: number;
  regions: Region[];
  confidence: number;
  pages?: number[];
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
  questionPaperName?: string;
  answerSheetName?: string;
  questions: Question[];
  answers: Answer[];
  mappings: Mapping[];
  totalPages: number;
  createdAt: string;
  error?: string;
}
