import { Router, Request, Response } from "express";
import path from "path";
import { v4 as uuid } from "uuid";
import { getAssessment, setAssessment, updateAssessment } from "../store";
import { runExtraction } from "../services/extraction.service";
import { Assessment } from "../types";

const router = Router();

// POST /api/assessment/upload
router.post("/upload", (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

  if (!files || !files.questionPaper || !files.answerSheet) {
    res.status(400).json({ error: "Both questionPaper and answerSheet files are required" });
    return;
  }

  const questionPaper = files.questionPaper[0];
  const answerSheet = files.answerSheet[0];

  const id = uuid();
  const assessment: Assessment = {
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

  setAssessment(assessment);

  res.json({
    id,
    status: assessment.status,
    questionPaperName: questionPaper.originalname,
    answerSheetName: answerSheet.originalname,
  });
});

// POST /api/assessment/extract
router.post("/extract", async (req: Request, res: Response) => {
  const { assessmentId } = req.body;

  if (!assessmentId) {
    res.status(400).json({ error: "assessmentId is required" });
    return;
  }

  const assessment = getAssessment(assessmentId);
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
  updateAssessment(assessmentId, { status: "extracting_questions" });

  // Don't await - let it run in background
  runExtraction(assessmentId, assessment);

  res.json({ status: "processing", assessmentId });
});

// POST /api/assessment/map (re-map answers)
router.post("/map", async (req: Request, res: Response) => {
  const { assessmentId } = req.body;

  if (!assessmentId) {
    res.status(400).json({ error: "assessmentId is required" });
    return;
  }

  const assessment = getAssessment(assessmentId);
  if (!assessment) {
    res.status(404).json({ error: "Assessment not found" });
    return;
  }
  if (!process.env.GEMINI_API_KEY) {
    res.status(503).json({ error: "Live extraction is not configured. Set GEMINI_API_KEY in backend/.env and restart the backend." });
    return;
  }

  // Re-run mapping on existing data
  updateAssessment(assessmentId, { status: "mapping_answers" });
  runExtraction(assessmentId, assessment);

  res.json({ status: "re-mapping", assessmentId });
});

// GET /api/assessment/:id
router.get("/:id", (req: Request, res: Response) => {
  const assessment = getAssessment(req.params.id);
  if (!assessment) {
    res.status(404).json({ error: "Assessment not found" });
    return;
  }

  // Don't expose file paths
  const { questionPaperPath, answerSheetPath, ...safe } = assessment;
  res.json(safe);
});

// GET /api/assessment/:id/file/:type - serve uploaded files
router.get("/:id/file/:type", (req: Request, res: Response) => {
  const assessment = getAssessment(req.params.id);
  if (!assessment) {
    res.status(404).json({ error: "Assessment not found" });
    return;
  }

  const filePath =
    req.params.type === "question"
      ? assessment.questionPaperPath
      : assessment.answerSheetPath;

  if (!filePath) {
    res.status(404).json({ error: "File not found" });
    return;
  }

  res.sendFile(path.resolve(filePath));
});

export default router;
