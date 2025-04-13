'use server';
/**
 * @fileOverview Orchestrates the generation of study materials including study guide, flashcards, and MCQs.
 *
 * - generateStudyMaterials - A function that handles the study material generation process.
 * - GenerateStudyMaterialsInput - The input type for the generateStudyMaterials function.
 * - GenerateStudyMaterialsOutput - The return type for the generateStudyMaterials function.
 */

import {ai} from '@/ai/ai-instance';
import {generateStudyGuide, GenerateStudyGuideOutput} from '@/ai/flows/study-guide-generation';
import {generateFlashcards, GenerateFlashcardsOutput} from '@/ai/flows/flashcard-generation';
import {generateMcqTest, GenerateMcqTestOutput} from '@/ai/flows/mcq-test-generation';
import {z} from 'genkit';

const GenerateStudyMaterialsInputSchema = z.object({
  syllabusContent: z.string().describe('The syllabus content to generate study materials from.'),
  numberOfMcqQuestions: z.number().default(5).describe('The number of MCQs to generate.')
});

export type GenerateStudyMaterialsInput = z.infer<typeof GenerateStudyMaterialsInputSchema>;

const GenerateStudyMaterialsOutputSchema = z.object({
  studyGuide: z.string().describe('The generated study guide.'),
  flashcards: z.array(z.object({
    term: z.string().describe('The term or concept.'),
    definition: z.string().describe('The definition of the term.'),
  })).describe('The generated flashcards.'),
  mcqTest: z.object({
    mcqTest: z.array(
      z.object({
        question: z.string().describe('The multiple-choice question.'),
        options: z.array(z.string()).describe('The options for the question.'),
        correctAnswer: z.string().describe('The correct answer to the question.'),
      })
    ).
describe('A list of multiple-choice questions with options and correct answers.'),
  }).describe('The generated mcq test'),
});

export type GenerateStudyMaterialsOutput = z.infer<typeof GenerateStudyMaterialsOutputSchema>;

export async function generateStudyMaterials(input: GenerateStudyMaterialsInput): Promise<GenerateStudyMaterialsOutput> {
  return generateStudyMaterialsFlow(input);
}

const generateStudyMaterialsFlow = ai.defineFlow<
  typeof GenerateStudyMaterialsInputSchema,
  typeof GenerateStudyMaterialsOutputSchema
>({
  name: 'generateStudyMaterialsFlow',
  inputSchema: GenerateStudyMaterialsInputSchema,
  outputSchema: GenerateStudyMaterialsOutputSchema,
},
async input => {
  const studyGuideOutput: GenerateStudyGuideOutput = await generateStudyGuide({content: input.syllabusContent});
  const flashcardsOutput: GenerateFlashcardsOutput = await generateFlashcards({content: input.syllabusContent});
  const mcqTestOutput: GenerateMcqTestOutput = await generateMcqTest({syllabusContent: input.syllabusContent, numberOfQuestions: input.numberOfMcqQuestions});

  return {
    studyGuide: studyGuideOutput.studyGuide,
    flashcards: flashcardsOutput,
    mcqTest: mcqTestOutput
  };
});
