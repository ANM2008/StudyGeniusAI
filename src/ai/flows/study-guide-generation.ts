// Commented out for static export build
// 'use server';
/**
 * @fileOverview Study guide generation AI agent.
 *
 * - generateStudyGuide - A function that handles the study guide generation process.
 * - GenerateStudyGuideInput - The input type for the generateStudyGuide function.
 * - GenerateStudyGuideOutput - The return type for the generateStudyGuide function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateStudyGuideInputSchema = z.object({
  content: z
    .string()
    .describe(
      'The content to generate a study guide from. Can be syllabus information from a PDF, website URL, or pasted text.'
    ),
});
export type GenerateStudyGuideInput = z.infer<typeof GenerateStudyGuideInputSchema>;

const GenerateStudyGuideOutputSchema = z.object({
  studyGuide: z
    .string()
    .describe('The generated study guide, including main topics and subtopics.'),
});
export type GenerateStudyGuideOutput = z.infer<typeof GenerateStudyGuideOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateStudyGuidePrompt',
  input: {
    schema: GenerateStudyGuideInputSchema,
  },
  output: {
    schema: GenerateStudyGuideOutputSchema,
  },
  prompt: `Create a comprehensive study guide from the following content. Format it without any HTML tags, use only markdown-style formatting:

Content: {{{content}}}

Formatting rules:
1. Use ### for the main title
2. Use ## for major sections
3. Use # for subsections
4. Use bullet points (•) for key points
5. Use numbers (1. 2. etc) for examples or sequential items
6. Use *term* (single asterisks) to highlight important technical terms in the middle of text only, never at the end of a point
7. Leave appropriate spacing between sections
8. Keep points concise and clear
9. DO NOT use any HTML tags
10. DO NOT place asterisks (*) at the end of any line or bullet point

Example format:
### Topic Name

## Major Section 1

# Subsection 1.1
• A *technical concept* explained simply
• Another point that describes the process
1. First example using *important term* in context
2. Second example with explanation

# Subsection 1.2
• Definition of a *key term* and its application
• Explanation of the concept
`,
});

const generateStudyGuideFlow = ai.defineFlow({
  name: 'generateStudyGuideFlow',
  inputSchema: GenerateStudyGuideInputSchema,
  outputSchema: GenerateStudyGuideOutputSchema,
},
async (input: GenerateStudyGuideInput) => {
  const {output} = await prompt(input);
  return output!;
});

export async function generateStudyGuide(input: GenerateStudyGuideInput): Promise<GenerateStudyGuideOutput> {
  // Explicitly cast the result to the expected type
  return (await generateStudyGuideFlow(input)) as GenerateStudyGuideOutput;
}
