"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const assessment_1 = __importDefault(require("./routes/assessment"));
// Node 20+ can load a local .env file without an additional dependency.
if (typeof process.loadEnvFile === "function") {
    try {
        process.loadEnvFile();
    }
    catch {
        // .env is optional: mock mode remains fully functional without it.
    }
}
const app = (0, express_1.default)();
const PORT = parseInt(process.env.BACKEND_PORT || "3001", 10);
// Ensure uploads directory exists
const uploadsDir = path_1.default.join(__dirname, "..", "uploads");
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Multer configuration
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (_req, file, cb) => {
        const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) {
            cb(null, true);
        }
        else {
            cb(new Error(`File type ${ext} not supported. Use PDF, JPG, or PNG.`));
        }
    },
});
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Apply multer to upload route
app.use("/api/assessment/upload", upload.fields([
    { name: "questionPaper", maxCount: 1 },
    { name: "answerSheet", maxCount: 1 },
]));
// Routes
app.use("/api/assessment", assessment_1.default);
// Health check
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", mode: process.env.GEMINI_API_KEY ? "gemini" : "unconfigured" });
});
// Error handling
app.use((err, _req, res, _next) => {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
});
app.listen(PORT, () => {
    console.log(`\n🚀 Assessment API running on http://localhost:${PORT}`);
    console.log(`📋 Mode: ${process.env.GEMINI_API_KEY ? "Gemini AI" : "Mock (set GEMINI_API_KEY for AI)"}`);
    console.log(`📁 Uploads: ${uploadsDir}\n`);
});
//# sourceMappingURL=index.js.map