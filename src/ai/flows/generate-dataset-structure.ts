// Use server directive.
'use server';

/**
 * @fileOverview Dataset structure generation flow.
 *
 * generateDatasetStructure - A function that generates a dataset structure for fine-tuning an LLM.
 * GenerateDatasetStructureInput - The input type for the generateDatasetStructure function.
 * GenerateDatasetStructureOutput - The return type for the generateDatasetStructure function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateDatasetStructureInputSchema = z.object({
  applicationDescription: z.string().describe('The description of the LLM application.'),
});
export type GenerateDatasetStructureInput = z.infer<typeof GenerateDatasetStructureInputSchema>;

const GenerateDatasetStructureOutputSchema = z.object({
  datasetStructure: z.string().describe('The generated dataset structure for fine-tuning.'),
});
export type GenerateDatasetStructureOutput = z.infer<typeof GenerateDatasetStructureOutputSchema>;

export async function generateDatasetStructure(input: GenerateDatasetStructureInput): Promise<GenerateDatasetStructureOutput> {
  return generateDatasetStructureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDatasetStructurePrompt',
  input: {
    schema: z.object({
      applicationDescription: z.string().describe('The description of the LLM application.'),
    }),
  },
  output: {
    schema: z.object({
      datasetStructure: z.string().describe('The generated dataset structure for fine-tuning, including fields and data types.'),
    }),
  },
  prompt: `You are an AI expert in generating dataset structures for fine-tuning LLMs.

  Based on the application description provided, generate a suitable dataset structure for fine-tuning.
  Include the fields needed, their data types, and a brief description of each field. Ensure the structure is well-organized and efficient for training purposes.

  Application Description: {{{applicationDescription}}}

  Dataset Structure:`,
});

const generateDatasetStructureFlow = ai.defineFlow<
  typeof GenerateDatasetStructureInputSchema,
  typeof GenerateDatasetStructureOutputSchema
>(
  {
    name: 'generateDatasetStructureFlow',
    inputSchema: GenerateDatasetStructureInputSchema,
    outputSchema: GenerateDatasetStructureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
