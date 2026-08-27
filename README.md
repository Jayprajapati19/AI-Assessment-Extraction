# AssessAI — Assessment Extraction & Answer Mapping

Upload a question paper and a student answer sheet (PDF, JPG, or PNG). The app extracts questions, reads answers, maps them by content, and presents highlighted answer regions for review.

## Run locally

1. Copy `.env.example` to `backend/.env` and, if needed, `frontend/.env.local`.
2. In `backend`, run `npm install` then `npm run dev`.
3. In `frontend`, run `npm install` then `npm run dev`.
4. Open `http://localhost:3000`.

Without `GEMINI_API_KEY`, the app runs a realistic end-to-end mock pipeline, including matched, unanswered, review-needed, out-of-order, multi-page answers, and bounding boxes. Set `GEMINI_API_KEY` in the backend environment to use Gemini Vision.

## API

- `POST /api/assessment/upload` — multipart fields `questionPaper`, `answerSheet`
- `POST /api/assessment/extract` — `{ "assessmentId": "…" }`
- `POST /api/assessment/map` — re-runs processing for an assessment
- `GET /api/assessment/:id` — assessment state/results

## Deployment

Deploy `frontend` to Vercel (set `NEXT_PUBLIC_API_URL`) and `backend` to Render/Railway/Fly.io (set `BACKEND_PORT`, CORS policy, and optional `GEMINI_API_KEY`). The current in-memory store is deliberately ephemeral; use an object store/database for persistent production deployments.
