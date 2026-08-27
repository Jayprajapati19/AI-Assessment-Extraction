import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import assessmentRoutes from "./routes/assessment";

// Node 20+ can load a local .env file without an additional dependency.
if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch {
    // .env is optional: mock mode remains fully functional without it.
  }
}

const app = express();
const PORT = parseInt(process.env.BACKEND_PORT || "3001", 10);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} not supported. Use PDF, JPG, or PNG.`));
    }
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Apply multer to upload route
app.use(
  "/api/assessment/upload",
  upload.fields([
    { name: "questionPaper", maxCount: 1 },
    { name: "answerSheet", maxCount: 1 },
  ])
);

// Routes
app.use("/api/assessment", assessmentRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", mode: process.env.GEMINI_API_KEY ? "gemini" : "unconfigured" });
});

// Error handling
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Assessment API running on http://localhost:${PORT}`);
  console.log(`📋 Mode: ${process.env.GEMINI_API_KEY ? "Gemini AI" : "Mock (set GEMINI_API_KEY for AI)"}`);
  console.log(`📁 Uploads: ${uploadsDir}\n`);
});
