'use server';
/**
 * @fileOverview Generates multiple-choice questions (MCQs) based on syllabus content.
 *
 * - generateMcqTest - A function that generates MCQs.
 * - GenerateMcqTestInput - The input type for the generateMcqTest function.
 * - GenerateMcqTestOutput - The return type for the generateMcqTest function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateMcqTestInputSchema = z.object({
  syllabusContent: z
    .string()
    .describe('The syllabus content to generate MCQs from.'),
  numberOfQuestions: z
    .number()
    .default(5)
    .describe('The number of MCQs to generate.'),
});
export type GenerateMcqTestInput = z.infer<typeof GenerateMcqTestInputSchema>;

const GenerateMcqTestOutputSchema = z.object({
  mcqTest: z.array(
    z.object({
      question: z.string().describe('The multiple-choice question.'),
      options: z.array(z.string()).describe('The options for the question.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
    })
  ).
describe('A list of multiple-choice questions with options and correct answers.'),
});
export type GenerateMcqTestOutput = z.infer<typeof GenerateMcqTestOutputSchema>;

export async function generateMcqTest(
  input: GenerateMcqTestInput
): Promise<GenerateMcqTestOutput> {
  return generateMcqTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mcqTestGenerationPrompt',
  input: {
    schema: z.object({
      syllabusContent: z
        .string()
        .describe('The syllabus content to generate MCQs from.'),
      numberOfQuestions: z
        .number()
        .default(5)
        .describe('The number of MCQs to generate.'),
    }),
  },
  output: {
    schema: z.object({
      mcqTest: z.array(
        z.object({
          question: z.string().describe('The multiple-choice question.'),
          options: z.array(z.string()).describe('The options for the question.'),
          correctAnswer: z
            .string()
            .describe('The correct answer to the question.'),
        })
      ).
describe('A list of multiple-choice questions with options and correct answers.'),
    }),
  },
  prompt: `You are an expert in creating multiple-choice questions (MCQs) based on provided content.

  Based on the following syllabus content, generate {{numberOfQuestions}} MCQs. Each question should have four options, with one correct answer.

  Syllabus Content:
  {{syllabusContent}}

  Ensure that the questions are relevant to the content and test the user's knowledge of the key concepts.
  The output should be structured as a JSON object with a list of mcqTest, where each object contains the question, options, and correctAnswer.
  `,
});

const generateMcqTestFlow = ai.defineFlow<
  typeof GenerateMcqTestInputSchema,
  typeof GenerateMcqTestOutputSchema
>(
  {
    name: 'generateMcqTestFlow',
    inputSchema: GenerateMcqTestInputSchema,
    outputSchema: GenerateMcqTestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
