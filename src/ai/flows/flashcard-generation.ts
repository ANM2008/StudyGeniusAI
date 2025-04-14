// 'use server';
/**
 * @fileOverview Flashcard generation AI agent.
 *
 * - generateFlashcards - A function that handles the flashcard generation process.
 * - GenerateFlashcardsInput - The input type for the generateFlashcards function.
 * - GenerateFlashcardsOutput - The return type for the generateFlashcards function.
 */

// Commented out for static export build
// 'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateFlashcardsInputSchema = z.object({
  content: z.string().describe('The syllabus content to generate flashcards from.'),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const FlashcardSchema = z.object({
  term: z.string().describe('The term or concept to be learned.'),
  definition: z.string().describe('The definition or explanation of the term.'),
});

const GenerateFlashcardsOutputSchema = z.array(FlashcardSchema).describe('An array of flashcards.');
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

// Temporarily disabled for deployment
export async function generateFlashcards(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  return [];
}

// Mock implementation for static export: Call with dummy arguments
const prompt = ai.definePrompt({}); // Pass dummy config

// Mock implementation for static export: Call with dummy arguments
const generateFlashcardsFlow = ai.defineFlow({}, () => {}); // Pass dummy config and function

// The actual flow logic using the real 'prompt' would go here in development.
// For the mock build, we might export a dummy function or handle it differently.
// For now, let's keep the structure but acknowledge the mock nature.
// If generateFlashcardsFlow needs to be callable, it should match the mock signature:
// const generateFlashcardsFlow = async (input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> => {
//   // Mock behavior:
//   return [];
// };
// However, since ai.defineFlow() returns the async function directly in the mock,
// we just assign it. The handler logic inside the original defineFlow call
// is effectively ignored when using the mock ai instance.
