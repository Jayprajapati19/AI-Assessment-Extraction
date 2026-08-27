import { Assessment } from "../types";
export type ExtractionPipeline = {
    fullExtraction: (questionPaperPath: string, answerSheetPath: string, onStatusChange: (status: string) => void) => Promise<{
        questions: Assessment["questions"];
        answers: Assessment["answers"];
        mappings: Assessment["mappings"];
        totalPages: number;
    }>;
};
export declare function getExtractionService(): ExtractionPipeline;
export declare function runExtraction(assessmentId: string, assessment: Assessment): Promise<void>;
//# sourceMappingURL=extraction.service.d.ts.map