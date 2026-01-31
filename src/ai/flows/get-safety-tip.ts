'use server';

/**
 * @fileOverview A Genkit flow that provides a daily safety tip for elderly users.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SafetyTipOutputSchema = z.object({
  tip: z.string().describe('A short, practical safety tip regarding phone scams, tailored for an elderly audience.'),
});
export type SafetyTipOutput = z.infer<typeof SafetyTipOutputSchema>;

export async function getSafetyTip(): Promise<SafetyTipOutput> {
  return getSafetyTipFlow();
}

const prompt = ai.definePrompt({
  name: 'safetyTipPrompt',
  output: {schema: SafetyTipOutputSchema},
  prompt: `You are a security expert specializing in protecting elderly individuals from phone scams. 
  
  Please provide one short, clear, and easy-to-understand safety tip. 
  
  The tip should be encouraging and empowering, not fear-mongering. 
  
  Example: "If someone pressures you to act immediately, it's a red flag. A legitimate organization will give you time to think."
  
  Provide the tip now.`,
});

const getSafetyTipFlow = ai.defineFlow(
  {
    name: 'getSafetyTipFlow',
    outputSchema: SafetyTipOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);
