// Commented out for static export build
// 'use server';
/**
 * @fileOverview Orchestrates the generation of study materials including study guide, flashcards, and MCQs.
 * This is a mock implementation for static export.
 */

// Mock implementation for static export
export interface GenerateStudyMaterialsInput {
  syllabusContent: string;
  numberOfMcqQuestions: number;
}

export interface GenerateStudyMaterialsOutput {
  studyGuide: string;
  flashcards: Array<{
    term: string;
    definition: string;
  }>;
  mcqTest: {
    mcqTest: Array<{
      question: string;
      options: string[];
      correctAnswer: string;
    }>;
  };
}

// Mock function that returns dummy data for static export
export async function generateStudyMaterials(input: GenerateStudyMaterialsInput): Promise<GenerateStudyMaterialsOutput> {
  // Mock data for static build
  return {
    studyGuide: "This is a mock study guide. In the actual app, AI-generated content will appear here.",
    flashcards: [
      {
        term: "Mock Term 1",
        definition: "This is a mock definition for term 1."
      },
      {
        term: "Mock Term 2",
        definition: "This is a mock definition for term 2."
      }
    ],
    mcqTest: {
      mcqTest: [
        {
          question: "Mock question 1?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A"
        },
        {
          question: "Mock question 2?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option B"
        }
      ]
    }
  };
}
