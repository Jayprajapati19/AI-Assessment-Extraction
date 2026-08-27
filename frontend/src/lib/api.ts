import { Assessment } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, options);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || "Request failed");
  }
  return res.json();
}

export async function uploadFiles(
  questionPaper: File,
  answerSheet: File
): Promise<{ id: string; status: string }> {
  const formData = new FormData();
  formData.append("questionPaper", questionPaper);
  formData.append("answerSheet", answerSheet);

  return request("/api/assessment/upload", {
    method: "POST",
    body: formData,
  });
}

export async function startExtraction(
  assessmentId: string
): Promise<{ status: string; assessmentId: string }> {
  return request("/api/assessment/extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assessmentId }),
  });
}

export async function startMapping(
  assessmentId: string
): Promise<{ status: string; assessmentId: string }> {
  return request("/api/assessment/map", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assessmentId }),
  });
}

export async function getAssessment(id: string): Promise<Assessment> {
  return request(`/api/assessment/${id}`);
}

export function getFileUrl(assessmentId: string, type: "question" | "answer"): string {
  return `${API_URL}/api/assessment/${assessmentId}/file/${type}`;
}
