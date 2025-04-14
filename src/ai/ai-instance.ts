// This is a mock AI instance for static export
// Remove this file and use the real AI instance for development

import { z } from 'genkit'; // Use genkit's Zod export

// Basic mock schema structure expected for MCQs
const mockMcqTestOutput = {
  mcqTest: [],
};

// Basic mock schema structure expected for Study Guides
const mockStudyGuideOutput = {
  studyGuide: "",
};

// Define Zod schema for flashcards
const FlashcardSchema = z.object({ term: z.string(), definition: z.string() });
const FlashcardsArraySchema = z.array(FlashcardSchema);
// Create type alias for flashcards output
type FlashcardsOutputType = z.infer<typeof FlashcardsArraySchema>;
// Use the type alias for the mock output
const mockFlashcardsOutput: FlashcardsOutputType = [];

export const ai = {
  // Mock definePrompt to accept config and return a function
  // that accepts input and returns the expected output shape.
  definePrompt: (config: any) => {
    return async (input: any) => {
      console.warn('Using mock AI prompt:', config?.name || 'unknown prompt');
      let outputShape;
      const promptOutputSchema = config?.output?.schema;

      // Check schema type and keys using .shape
      if (promptOutputSchema instanceof z.ZodObject && 'mcqTest' in promptOutputSchema.shape) {
         outputShape = mockMcqTestOutput;
      } else if (promptOutputSchema instanceof z.ZodObject && 'studyGuide' in promptOutputSchema.shape) {
         outputShape = mockStudyGuideOutput;
      } else if (promptOutputSchema instanceof z.ZodArray) {
        outputShape = mockFlashcardsOutput;
      } else {
        console.warn(`Mock AI prompt: Unknown output schema shape for ${config?.name}. Returning default {}.`);
        outputShape = {}; // Fallback
      }
      // Prompts wrap their result in { output: ... }
      return Promise.resolve({ output: outputShape });
    };
  },
  // Mock defineFlow to accept config and a flow function,
  // and return a function that accepts input and returns the expected output shape.
  defineFlow: (config: any, flowFn: any) => {
    return async (input: any) => {
      console.warn('Using mock AI flow:', config?.name || 'unknown flow');
      let outputShape;
      const flowOutputSchema = config?.outputSchema;

      // Check schema type and keys using .shape
      if (flowOutputSchema instanceof z.ZodObject && 'mcqTest' in flowOutputSchema.shape) {
         outputShape = mockMcqTestOutput;
      } else if (flowOutputSchema instanceof z.ZodObject && 'studyGuide' in flowOutputSchema.shape) {
         outputShape = mockStudyGuideOutput;
      } else if (flowOutputSchema instanceof z.ZodArray) {
        outputShape = mockFlashcardsOutput;
      } else {
        console.warn(`Mock AI flow: Unknown output schema shape for ${config?.name}. Returning default {}.`);
        outputShape = {}; // Fallback
      }
      // Flows return the shape directly
      return Promise.resolve(outputShape);
    };
  },
};
