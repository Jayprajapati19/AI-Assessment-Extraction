"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtractionService = getExtractionService;
exports.runExtraction = runExtraction;
const gemini_service_1 = require("./gemini.service");
const store_1 = require("../store");
function getExtractionService() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
        throw new Error("GEMINI_API_KEY is not configured. Add it to backend/.env before processing uploads.");
    return new gemini_service_1.GeminiExtractionService(apiKey);
}
async function runExtraction(assessmentId, assessment) {
    try {
        const result = await getExtractionService().fullExtraction(assessment.questionPaperPath, assessment.answerSheetPath, (status) => (0, store_1.updateAssessment)(assessmentId, { status: status }));
        (0, store_1.updateAssessment)(assessmentId, { questions: result.questions, answers: result.answers, mappings: result.mappings, totalPages: result.totalPages, status: "completed" });
    }
    catch (error) {
        console.error("Extraction error:", error);
        (0, store_1.updateAssessment)(assessmentId, { status: "error", error: error.message || "Extraction failed" });
    }
}
//# sourceMappingURL=extraction.service.js.map