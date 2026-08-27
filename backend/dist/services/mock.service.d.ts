import { ExtractionService, Question, Answer, Mapping } from "../types";
export declare class MockExtractionService implements ExtractionService {
    extractQuestions(_filePath: string): Promise<Question[]>;
    extractAnswers(_filePath: string): Promise<Answer[]>;
    mapAnswers(questions: Question[], _answers: Answer[]): Promise<Mapping[]>;
    fullExtraction(_questionPaperPath: string, _answerSheetPath: string, onStatusChange: (status: string) => void): Promise<{
        questions: Question[];
        answers: Answer[];
        mappings: Mapping[];
        totalPages: number;
    }>;
}
//# sourceMappingURL=mock.service.d.ts.map