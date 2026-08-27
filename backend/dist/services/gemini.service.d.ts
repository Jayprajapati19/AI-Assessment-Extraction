import { Answer, ExtractionService, Mapping, Question } from "../types";
export declare class GeminiExtractionService implements ExtractionService {
    private ai;
    constructor(apiKey: string);
    private documentPart;
    private documentJson;
    extractQuestions(filePath: string): Promise<Question[]>;
    extractAnswers(filePath: string): Promise<Answer[]>;
    mapAnswers(questions: Question[], answers: Answer[]): Promise<Mapping[]>;
    fullExtraction(questionPaperPath: string, answerSheetPath: string, onStatusChange: (status: string) => void): Promise<{
        questions: Question[];
        answers: Answer[];
        mappings: Mapping[];
        totalPages: number;
    }>;
}
//# sourceMappingURL=gemini.service.d.ts.map