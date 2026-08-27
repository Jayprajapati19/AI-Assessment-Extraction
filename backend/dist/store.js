"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssessment = getAssessment;
exports.setAssessment = setAssessment;
exports.updateAssessment = updateAssessment;
exports.deleteAssessment = deleteAssessment;
exports.getAllAssessments = getAllAssessments;
const store = new Map();
function getAssessment(id) {
    return store.get(id);
}
function setAssessment(assessment) {
    store.set(assessment.id, assessment);
}
function updateAssessment(id, updates) {
    const existing = store.get(id);
    if (!existing)
        return undefined;
    const updated = { ...existing, ...updates };
    store.set(id, updated);
    return updated;
}
function deleteAssessment(id) {
    return store.delete(id);
}
function getAllAssessments() {
    return Array.from(store.values());
}
//# sourceMappingURL=store.js.map