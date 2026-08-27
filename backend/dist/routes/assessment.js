"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const store_1 = require("../store");
const extraction_service_1 = require("../services/extraction.service");
const router = (0, express_1.Router)();
// POST /api/assessment/upload
router.post("/upload", (req, res) => {
    const files = req.files;
    if (!files || !files.questionPaper || !files.answerSheet) {
        res.status(400).json({ error: "Both questionPaper and answerSheet files are required" });
        return;
    }
    const questionPaper = files.questionPaper[0];
    const answerSheet = files.answerSheet[0];
    const id = (0, uuid_1.v4)();
    const assessment = {
        id,
        status: "uploaded",
        questionPaperPath: questionPaper.path,
        answerSheetPath: answerSheet.path,
        questionPaperName: questionPaper.originalname,
        answerSheetName: answerSheet.originalname,
        questions: [],
        answers: [],
        mappings: [],
        totalPages: 0,
        createdAt: new Date().toISOString(),
    };
    (0, store_1.setAssessment)(assessment);
    res.json({
        id,
        status: assessment.status,
        questionPaperName: questionPaper.originalname,
        answerSheetName: answerSheet.originalname,
    });
});
// POST /api/assessment/extract
router.post("/extract", async (req, res) => {
    const { assessmentId } = req.body;
    if (!assessmentId) {
        res.status(400).json({ error: "assessmentId is required" });
        return;
    }
    const assessment = (0, store_1.getAssessment)(assessmentId);
    if (!assessment) {
        res.status(404).json({ error: "Assessment not found" });
        return;
    }
    if (!assessment.questionPaperPath || !assessment.answerSheetPath) {
        res.status(400).json({ error: "Both files must be uploaded first" });
        return;
    }
    if (!process.env.GEMINI_API_KEY) {
        res.status(503).json({ error: "Live extraction is not configured. Set GEMINI_API_KEY in backend/.env and restart the backend." });
        return;
    }
    // Start extraction in background
    (0, store_1.updateAssessment)(assessmentId, { status: "extracting_questions" });
    // Don't await - let it run in background
    (0, extraction_service_1.runExtraction)(assessmentId, assessment);
    res.json({ status: "processing", assessmentId });
});
// POST /api/assessment/map (re-map answers)
router.post("/map", async (req, res) => {
    const { assessmentId } = req.body;
    if (!assessmentId) {
        res.status(400).json({ error: "assessmentId is required" });
        return;
    }
    const assessment = (0, store_1.getAssessment)(assessmentId);
    if (!assessment) {
        res.status(404).json({ error: "Assessment not found" });
        return;
    }
    if (!process.env.GEMINI_API_KEY) {
        res.status(503).json({ error: "Live extraction is not configured. Set GEMINI_API_KEY in backend/.env and restart the backend." });
        return;
    }
    // Re-run mapping on existing data
    (0, store_1.updateAssessment)(assessmentId, { status: "mapping_answers" });
    (0, extraction_service_1.runExtraction)(assessmentId, assessment);
    res.json({ status: "re-mapping", assessmentId });
});
// GET /api/assessment/:id
router.get("/:id", (req, res) => {
    const assessment = (0, store_1.getAssessment)(req.params.id);
    if (!assessment) {
        res.status(404).json({ error: "Assessment not found" });
        return;
    }
    // Don't expose file paths
    const { questionPaperPath, answerSheetPath, ...safe } = assessment;
    res.json(safe);
});
// GET /api/assessment/:id/file/:type - serve uploaded files
router.get("/:id/file/:type", (req, res) => {
    const assessment = (0, store_1.getAssessment)(req.params.id);
    if (!assessment) {
        res.status(404).json({ error: "Assessment not found" });
        return;
    }
    const filePath = req.params.type === "question"
        ? assessment.questionPaperPath
        : assessment.answerSheetPath;
    if (!filePath) {
        res.status(404).json({ error: "File not found" });
        return;
    }
    res.sendFile(path_1.default.resolve(filePath));
});
exports.default = router;
//# sourceMappingURL=assessment.js.map