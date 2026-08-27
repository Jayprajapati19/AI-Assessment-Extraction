import { Assessment } from "./types";
export declare function getAssessment(id: string): Assessment | undefined;
export declare function setAssessment(assessment: Assessment): void;
export declare function updateAssessment(id: string, updates: Partial<Assessment>): Assessment | undefined;
export declare function deleteAssessment(id: string): boolean;
export declare function getAllAssessments(): Assessment[];
//# sourceMappingURL=store.d.ts.map