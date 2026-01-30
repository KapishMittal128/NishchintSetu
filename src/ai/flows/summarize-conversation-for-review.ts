'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing a conversation for review,
 * generating a concise summary to help reviewers quickly understand the context of a potentially
 * fraudulent conversation.
 *
 * @exports summarizeConversationForReview - An async function that summarizes a conversation.
 * @exports SummarizeConversationForReviewInput - The input type for the summarizeConversationForReview function.
 * @exports SummarizeConversationForReviewOutput - The output type for the summarizeConversationForReview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeConversationForReviewInputSchema = z.object({
  conversationText: z
    .string()
    .describe('The complete text of the conversation to be summarized.'),
  riskScore: z
    .number()
    .describe(
      'The overall risk score of the conversation, used to emphasize high-risk factors in the summary.'
    ),
});
export type SummarizeConversationForReviewInput = z.infer<
  typeof SummarizeConversationForReviewInputSchema
>;

const SummarizeConversationForReviewOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the conversation, highlighting key points and potential scam indicators.'
    ),
});
export type SummarizeConversationForReviewOutput = z.infer<
  typeof SummarizeConversationForReviewOutputSchema
>;

export async function summarizeConversationForReview(
  input: SummarizeConversationForReviewInput
): Promise<SummarizeConversationForReviewOutput> {
  return summarizeConversationForReviewFlow(input);
}

const summarizeConversationPrompt = ai.definePrompt({
  name: 'summarizeConversationPrompt',
  input: {schema: SummarizeConversationForReviewInputSchema},
  output: {schema: SummarizeConversationForReviewOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing conversations for fraud review.

  Given the following conversation and its associated risk score, create a concise summary that highlights potential scam indicators.
  Focus on key points, suspicious patterns, and any elements that contribute to the overall risk.

  Conversation:
  {{conversationText}}

  Risk Score: {{riskScore}}

  Summary:`,
});

const summarizeConversationForReviewFlow = ai.defineFlow(
  {
    name: 'summarizeConversationForReviewFlow',
    inputSchema: SummarizeConversationForReviewInputSchema,
    outputSchema: SummarizeConversationForReviewOutputSchema,
  },
  async input => {
    const {output} = await summarizeConversationPrompt(input);
    return output!;
  }
);
