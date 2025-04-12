// Use server directive for server-side execution
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating the response format for an LLM application.
 *
 * It takes the application description as input and returns a suggested response format.
 * - generateResponseFormat - A function that handles the response format generation process.
 * - GenerateResponseFormatInput - The input type for the generateResponseFormat function.
 * - GenerateResponseFormatOutput - The return type for the generateResponseFormat function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

// Define the input schema
const GenerateResponseFormatInputSchema = z.object({
  applicationDescription: z
    .string()
    .describe('A description of the LLM application for which to generate a response format.'),
});
export type GenerateResponseFormatInput = z.infer<
  typeof GenerateResponseFormatInputSchema
>;

// Define the output schema
const GenerateResponseFormatOutputSchema = z.object({
  responseFormat: z
    .string()
    .describe('A suggested response format for the LLM application.'),
});
export type GenerateResponseFormatOutput = z.infer<
  typeof GenerateResponseFormatOutputSchema
>;

export async function generateResponseFormat(
  input: GenerateResponseFormatInput
): Promise<GenerateResponseFormatOutput> {
  return generateResponseFormatFlow(input);
}

// Define the prompt
const prompt = ai.definePrompt({
  name: 'generateResponseFormatPrompt',
  input: {
    schema: z.object({
      applicationDescription: z
        .string()
        .describe(
          'A description of the LLM application for which to generate a response format.'
        ),
    }),
  },
  output: {
    schema: z.object({
      responseFormat: z
        .string()
        .describe('A suggested response format for the LLM application.'),
    }),
  },
  prompt: `You are an AI expert in designing LLM applications. Based on the application description provided, generate a suggested response format for the LLM to follow. The response format should be structured and easy to parse.

Application Description: {{{applicationDescription}}}

Suggested Response Format:`, // Handlebars syntax for accessing input values
});

// Define the flow
const generateResponseFormatFlow = ai.defineFlow<
  typeof GenerateResponseFormatInputSchema,
  typeof GenerateResponseFormatOutputSchema
>(
  {
    name: 'generateResponseFormatFlow',
    inputSchema: GenerateResponseFormatInputSchema,
    outputSchema: GenerateResponseFormatOutputSchema,
  },
  async input => {
    // Call the prompt with the input
    const {output} = await prompt(input);
    return output!;
  }
);
