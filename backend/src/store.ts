import { Assessment } from "./types";

const store = new Map<string, Assessment>();

export function getAssessment(id: string): Assessment | undefined {
  return store.get(id);
}

export function setAssessment(assessment: Assessment): void {
  store.set(assessment.id, assessment);
}

export function updateAssessment(
  id: string,
  updates: Partial<Assessment>
): Assessment | undefined {
  const existing = store.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...updates };
  store.set(id, updated);
  return updated;
}

export function deleteAssessment(id: string): boolean {
  return store.delete(id);
}

export function getAllAssessments(): Assessment[] {
  return Array.from(store.values());
}
