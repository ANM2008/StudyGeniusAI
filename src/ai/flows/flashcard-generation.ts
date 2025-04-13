// 'use server';
/**
 * @fileOverview Flashcard generation AI agent.
 *
 * - generateFlashcards - A function that handles the flashcard generation process.
 * - GenerateFlashcardsInput - The input type for the generateFlashcards function.
 * - GenerateFlashcardsOutput - The return type for the generateFlashcards function.
 */

'use server';

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

export async function generateFlashcards(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: {
    schema: z.object({
      content: z.string().describe('The syllabus content to generate flashcards from.'),
    }),
  },
  output: {
    schema: z.array(z.object({
      term: z.string().describe('The term or concept to be learned.'),
      definition: z.string().describe('The definition or explanation of the term.'),
    })),
  },
  prompt: `You are an expert educator. Generate flashcards (term and definition) based on the following content. Focus on key concepts and terms.

Content: {{{content}}}

Flashcards:`, // Ensure the LLM knows what flashcards are.
});

const generateFlashcardsFlow = ai.defineFlow<
  typeof GenerateFlashcardsInputSchema,
  typeof GenerateFlashcardsOutputSchema
>({
  name: 'generateFlashcardsFlow',
  inputSchema: GenerateFlashcardsInputSchema,
  outputSchema: GenerateFlashcardsOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});