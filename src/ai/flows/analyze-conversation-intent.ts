'use server';

/**
 * @fileOverview A conversational intent analysis AI agent.
 *
 * - analyzeConversationIntent - A function that handles the conversational intent analysis process.
 * - AnalyzeConversationIntentInput - The input type for the analyzeConversationIntent function.
 * - AnalyzeConversationIntentOutput - The return type for the analyzeConversationIntent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeConversationIntentInputSchema = z.object({
  conversationHistory: z
    .string()
    .describe('The complete history of the conversation.'),
  currentTurn: z.string().describe('The current turn in the conversation.'),
});
export type AnalyzeConversationIntentInput = z.infer<
  typeof AnalyzeConversationIntentInputSchema
>;

const AnalyzeConversationIntentOutputSchema = z.object({
  intent: z
    .string()
    .describe(
      'The identified intent of the current turn in the conversation.'
    ),
  sentiment: z
    .string()
    .describe('The sentiment of the current turn in the conversation.'),
  riskAssessment: z
    .string()
    .describe(
      'An assessment of the risk associated with the current turn, based on the intent and sentiment.'
    ),
  scamIndicators: z
    .array(z.string())
    .describe(
      'A list of potential scam indicators identified in the conversation.'
    ),
});
export type AnalyzeConversationIntentOutput = z.infer<
  typeof AnalyzeConversationIntentOutputSchema
>;

export async function analyzeConversationIntent(
  input: AnalyzeConversationIntentInput
): Promise<AnalyzeConversationIntentOutput> {
  return analyzeConversationIntentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeConversationIntentPrompt',
  input: {schema: AnalyzeConversationIntentInputSchema},
  output: {schema: AnalyzeConversationIntentOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing conversation intent and identifying potential scam risks.

  Analyze the provided conversation history and the current turn to determine the intent, sentiment, and potential scam indicators.

  Conversation History:
  {{conversationHistory}}

  Current Turn:
  {{currentTurn}}

  Provide a risk assessment based on your analysis.

  Output your result as a JSON object matching the following schema. Descriptions of the fields are provided as comments, use them to guide you.
  \`\`\`json
  {
    "intent": "", // The identified intent of the current turn in the conversation. (e.g., information seeking, persuasion, etc.)
    "sentiment": "", // The sentiment of the current turn in the conversation. (e.g., positive, negative, neutral)
    "riskAssessment": "", // An assessment of the risk associated with the current turn, based on the intent and sentiment. (e.g., low, medium, high)
    "scamIndicators": [""], // A list of potential scam indicators identified in the conversation. (e.g., request for personal information, pressure to act quickly, etc.)
  }
  \`\`\`
`,
});

const analyzeConversationIntentFlow = ai.defineFlow(
  {
    name: 'analyzeConversationIntentFlow',
    inputSchema: AnalyzeConversationIntentInputSchema,
    outputSchema: AnalyzeConversationIntentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
