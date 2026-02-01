'use server';

/**
 * @fileOverview A conversational AI chatbot for providing scam prevention advice.
 *
 * - chat - The main function to interact with the chatbot.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
      })
    )
    .describe('The conversation history.'),
  message: z.string().describe('The latest message from the user.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe("The AI's response to the user."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are Nishchint, a friendly and empathetic AI assistant for the Nishchint Setu app. Your primary purpose is to help users, particularly the elderly, stay safe from phone scams.

  - Your tone should be simple, clear, and reassuring. Avoid technical jargon.
  - When asked a question, provide helpful advice related to scam prevention.
  - You can answer general questions, but always gently steer the conversation back towards online and phone safety if possible.
  - Do not provide financial, legal, or medical advice.
  - Keep your answers concise and easy to understand.

  Here is the conversation history:
  {{#each history}}
  **{{role}}**: {{content}}
  {{/each}}

  Here is the user's new message:
  **user**: {{message}}

  Your response:`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
