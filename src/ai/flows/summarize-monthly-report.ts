'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing monthly user activity for an emergency contact.
 *
 * @exports summarizeMonthlyReport - An async function that generates a summary.
 * @exports MonthlyReportInput - The input type for the function.
 * @exports MonthlyReportOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MonthlyReportInputSchema = z.object({
  userName: z.string().describe("The name of the user the report is for."),
  alertCount: z.number().describe('The total number of high-risk alerts this month.'),
  highestRiskScore: z.number().describe('The highest risk score recorded this month.'),
  moodSummary: z
    .object({
      happy: z.number(),
      neutral: z.number(),
      sad: z.number(),
    })
    .describe('A summary of mood entries for the month.'),
});
export type MonthlyReportInput = z.infer<typeof MonthlyReportInputSchema>;

const MonthlyReportOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise, empathetic summary of the user\'s activity for the month, written for their emergency contact. Highlight any trends or areas of concern.'
    ),
});
export type MonthlyReportOutput = z.infer<typeof MonthlyReportOutputSchema>;

export async function summarizeMonthlyReport(
  input: MonthlyReportInput
): Promise<MonthlyReportOutput> {
  return summarizeMonthlyReportFlow(input);
}

const reportPrompt = ai.definePrompt({
  name: 'summarizeMonthlyReportPrompt',
  input: {schema: MonthlyReportInputSchema},
  output: {schema: MonthlyReportOutputSchema},
  prompt: `You are an AI assistant helping an emergency contact understand a monthly safety report for their loved one, {{{userName}}}.
  Your tone should be helpful and reassuring, not alarming.

  Here is the data for the past month:
  - Total high-risk alerts: {{{alertCount}}}
  - Highest risk score seen: {{{highestRiskScore}}}
  - Mood entries: {{{moodSummary.happy}}} happy, {{{moodSummary.neutral}}} neutral, {{{moodSummary.sad}}} sad.

  Based on this data, write a short, easy-to-understand summary.
  - If alertCount is 0, congratulate the user on a safe month.
  - If there are alerts, mention it calmly and point out that they can review the details in the app.
  - Comment on the mood trends if there are any moods recorded. For example, if 'sad' is high, suggest checking in. If 'happy' is high, mention that's a positive sign.
  - Conclude on a positive and supportive note.

  Generate the summary now.`,
});

const summarizeMonthlyReportFlow = ai.defineFlow(
  {
    name: 'summarizeMonthlyReportFlow',
    inputSchema: MonthlyReportInputSchema,
    outputSchema: MonthlyReportOutputSchema,
  },
  async input => {
    const {output} = await reportPrompt(input);
    return output!;
  }
);
