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
    questionRef?: string;
}
export interface Mapping {
    questionId: string;
    answerId?: string;
    status: "matched" | "unanswered" | "needs_review";
    confidence?: number;
}
export type AssessmentStatus = "uploaded" | "extracting_questions" | "extracting_answers" | "detecting_regions" | "mapping_answers" | "completed" | "error";
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
//# sourceMappingURL=types.d.ts.map