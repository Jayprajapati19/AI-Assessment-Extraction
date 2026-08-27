"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockExtractionService = void 0;
const uuid_1 = require("uuid");
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const MOCK_QUESTIONS = [
    { id: (0, uuid_1.v4)(), text: "Define the term 'photosynthesis' and explain its importance in the ecosystem.", marks: 5, order: 1, displayNumber: "1" },
    { id: (0, uuid_1.v4)(), text: "State two differences between mitosis and meiosis.", marks: 4, order: 2, displayNumber: "2" },
    { id: (0, uuid_1.v4)(), text: "What is Newton's Second Law of Motion? Provide the mathematical formula.", marks: 3, order: 3, displayNumber: "3" },
    { id: (0, uuid_1.v4)(), text: "Explain the water cycle with the help of a diagram.", marks: 6, order: 4, displayNumber: "4" },
    { id: (0, uuid_1.v4)(), text: "Solve the following quadratic equation: x² - 5x + 6 = 0", marks: 4, order: 5, displayNumber: "5" },
    { id: (0, uuid_1.v4)(), text: "Describe the structure of an atom.", marks: 3, order: 6, displayNumber: "6" },
    { id: (0, uuid_1.v4)(), text: "What is the chemical formula for glucose? Describe its role in cellular respiration.", marks: 5, order: 7, displayNumber: "7" },
    { id: (0, uuid_1.v4)(), text: "Write a short note on the French Revolution.", marks: 6, order: 8, displayNumber: "8" },
    { id: (0, uuid_1.v4)(), text: "Explain the concept of supply and demand with a graph.", marks: 5, order: 9, displayNumber: "9" },
    { id: (0, uuid_1.v4)(), text: "Define acceleration and give its SI unit.", marks: 2, order: 10, displayNumber: "10" },
    { id: (0, uuid_1.v4)(), text: "Explain the greenhouse effect.", marks: 4, order: 11, parentNumber: "11", subQuestion: "a", displayNumber: "11(a)" },
    { id: (0, uuid_1.v4)(), text: "List three greenhouse gases and their sources.", marks: 3, order: 12, parentNumber: "11", subQuestion: "b", displayNumber: "11(b)" },
];
function createMockAnswers(questions) {
    const answers = [];
    // Answer for Q1 - matched, high confidence
    answers.push({
        id: (0, uuid_1.v4)(),
        questionId: questions[0].id,
        text: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water. It is important because it produces oxygen and is the foundation of the food chain in most ecosystems.",
        page: 1,
        regions: [{ x: 0.05, y: 0.08, width: 0.9, height: 0.18 }],
        confidence: 0.95,
    });
    // Answer for Q2 - matched
    answers.push({
        id: (0, uuid_1.v4)(),
        questionId: questions[1].id,
        text: "Mitosis produces two identical daughter cells while meiosis produces four genetically different cells. Mitosis is for growth and repair, meiosis is for producing gametes.",
        page: 1,
        regions: [{ x: 0.05, y: 0.30, width: 0.9, height: 0.14 }],
        confidence: 0.92,
    });
    // Answer for Q3 - matched
    answers.push({
        id: (0, uuid_1.v4)(),
        questionId: questions[2].id,
        text: "Newton's Second Law states that the force acting on an object is equal to the mass of that object times its acceleration. F = ma.",
        page: 1,
        regions: [{ x: 0.05, y: 0.50, width: 0.9, height: 0.12 }],
        confidence: 0.97,
    });
    // Answer for Q4 - multi-page, matched
    answers.push({
        id: (0, uuid_1.v4)(),
        questionId: questions[3].id,
        text: "The water cycle consists of evaporation, condensation, precipitation, and collection. Water evaporates from oceans and lakes, forms clouds through condensation, falls as precipitation, and collects in bodies of water. [Diagram on next page]",
        page: 1,
        pages: [1, 2],
        regions: [
            { x: 0.05, y: 0.68, width: 0.9, height: 0.28 },
        ],
        confidence: 0.88,
    });
    // Answer for Q5 - written out of order on page 3, matched
    answers.push({
        id: (0, uuid_1.v4)(),
        questionId: questions[4].id,
        text: "x² - 5x + 6 = 0\n(x-2)(x-3) = 0\nTherefore x = 2 or x = 3",
        page: 3,
        regions: [{ x: 0.05, y: 0.05, width: 0.55, height: 0.20 }],
        confidence: 0.94,
    });
    // Answer for Q6 - matched
    answers.push({
        id: (0, uuid_1.v4)(),
        questionId: questions[5].id,
        text: "An atom consists of a nucleus containing protons and neutrons, surrounded by electrons orbiting in shells. Protons are positively charged, electrons are negatively charged, and neutrons are neutral.",
        page: 2,
        regions: [{ x: 0.05, y: 0.32, width: 0.9, height: 0.15 }],
        confidence: 0.91,
    });
    // Q7 - unanswered (no answer provided)
    // Answer for Q8 - matched but low confidence (needs review)
    answers.push({
        id: (0, uuid_1.v4)(),
        questionId: questions[7].id,
        text: "The French Revolution began in 1789... [partially illegible handwriting] ...the storming of the Bastille... led to major political changes in France and inspired democratic movements worldwide.",
        page: 2,
        regions: [{ x: 0.05, y: 0.52, width: 0.9, height: 0.22 }],
        confidence: 0.62,
    });
    // Answer for Q9 - matched
    answers.push({
        id: (0, uuid_1.v4)(),
        questionId: questions[8].id,
        text: "Supply and demand is an economic model that determines the price in a market. When demand increases and supply remains constant, prices rise. When supply increases and demand remains constant, prices fall. The equilibrium point is where supply meets demand.",
        page: 3,
        regions: [{ x: 0.05, y: 0.30, width: 0.9, height: 0.25 }],
        confidence: 0.89,
    });
    // Answer for Q10 - matched
    answers.push({
        id: (0, uuid_1.v4)(),
        questionId: questions[9].id,
        text: "Acceleration is the rate of change of velocity with respect to time. SI unit: m/s² (metres per second squared).",
        page: 3,
        regions: [{ x: 0.05, y: 0.60, width: 0.7, height: 0.10 }],
        confidence: 0.96,
    });
    // Answer for Q11(a) - matched
    answers.push({
        id: (0, uuid_1.v4)(),
        questionId: questions[10].id,
        text: "The greenhouse effect is a natural process where certain gases in Earth's atmosphere trap heat from the sun, warming the planet's surface. Without it, Earth would be too cold to support life. However, human activities have intensified this effect.",
        page: 3,
        regions: [{ x: 0.05, y: 0.74, width: 0.9, height: 0.15 }],
        confidence: 0.90,
    });
    // Answer for Q11(b) - needs review (low confidence)
    answers.push({
        id: (0, uuid_1.v4)(),
        questionId: questions[11].id,
        text: "CO2 from burning fossil fuels... methane from agriculture... [hard to read] ...nitrous oxide from...",
        page: 4,
        regions: [{ x: 0.05, y: 0.05, width: 0.85, height: 0.18 }],
        confidence: 0.55,
    });
    return answers;
}
function createMockMappings(questions, answers) {
    return questions.map((q) => {
        const answer = answers.find((a) => a.questionId === q.id);
        if (!answer) {
            return { questionId: q.id, status: "unanswered" };
        }
        if (answer.confidence < 0.7) {
            return {
                questionId: q.id,
                answerId: answer.id,
                status: "needs_review",
                confidence: answer.confidence,
            };
        }
        return {
            questionId: q.id,
            answerId: answer.id,
            status: "matched",
            confidence: answer.confidence,
        };
    });
}
class MockExtractionService {
    async extractQuestions(_filePath) {
        await delay(1500);
        return MOCK_QUESTIONS.map((q) => ({ ...q, id: (0, uuid_1.v4)() }));
    }
    async extractAnswers(_filePath) {
        await delay(2000);
        // Will be called after questions are available
        return [];
    }
    async mapAnswers(questions, _answers) {
        await delay(1500);
        const answers = createMockAnswers(questions);
        const mappings = createMockMappings(questions, answers);
        return mappings;
    }
    // Full pipeline method used by the extraction service
    async fullExtraction(_questionPaperPath, _answerSheetPath, onStatusChange) {
        onStatusChange("extracting_questions");
        await delay(2000);
        const questions = MOCK_QUESTIONS.map((q) => ({ ...q, id: (0, uuid_1.v4)() }));
        onStatusChange("extracting_answers");
        await delay(2500);
        const answers = createMockAnswers(questions);
        onStatusChange("detecting_regions");
        await delay(1500);
        onStatusChange("mapping_answers");
        await delay(2000);
        const mappings = createMockMappings(questions, answers);
        return { questions, answers, mappings, totalPages: 4 };
    }
}
exports.MockExtractionService = MockExtractionService;
//# sourceMappingURL=mock.service.js.map