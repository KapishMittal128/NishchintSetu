'use server';

/**
 * @fileOverview This file defines a Genkit flow for explaining the risk score of a conversation.
 *
 * The flow takes a risk score as input and returns a textual explanation of why the conversation might be a scam.
 *
 * @remarks
 * The flow uses a prompt to generate the explanation based on the risk score.
 *
 * @exports explainRiskScore - The main function to call to get a risk explanation.
 * @exports ExplainRiskScoreInput - The input type for the explainRiskScore function.
 * @exports ExplainRiskScoreOutput - The output type for the explainRiskScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainRiskScoreInputSchema = z.object({
  riskScore: z.number().describe('The risk score of the conversation.'),
  context: z.string().optional().describe('Additional context about the conversation.'),
});
export type ExplainRiskScoreInput = z.infer<typeof ExplainRiskScoreInputSchema>;

const ExplainRiskScoreOutputSchema = z.object({
  explanation: z.string().describe('A textual explanation of the risk score.'),
});
export type ExplainRiskScoreOutput = z.infer<typeof ExplainRiskScoreOutputSchema>;

/**
 * Explains the risk score of a conversation.
 *
 * @param input - The input to the function.
 * @returns The explanation of the risk score.
 */
export async function explainRiskScore(input: ExplainRiskScoreInput): Promise<ExplainRiskScoreOutput> {
  return explainRiskScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainRiskScorePrompt',
  input: {schema: ExplainRiskScoreInputSchema},
  output: {schema: ExplainRiskScoreOutputSchema},
  prompt: `You are an expert in detecting scams. Given a risk score and some context about a conversation, explain why the conversation might be a scam.

Risk Score: {{{riskScore}}}
Context: {{{context}}}

Explanation: `,
});

const explainRiskScoreFlow = ai.defineFlow(
  {
    name: 'explainRiskScoreFlow',
    inputSchema: ExplainRiskScoreInputSchema,
    outputSchema: ExplainRiskScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
