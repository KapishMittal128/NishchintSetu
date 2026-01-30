
'use server';

import { analyzeConversationIntent } from '@/ai/flows/analyze-conversation-intent';
import { explainRiskScore } from '@/ai/flows/explain-risk-score';

export async function getRiskAnalysis(conversationHistory: string, currentTurn: string) {
  try {
    const analysis = await analyzeConversationIntent({
      conversationHistory,
      currentTurn,
    });
    return analysis;
  } catch (error) {
    console.error('Error in getRiskAnalysis:', error);
    return {
      intent: 'unknown',
      sentiment: 'unknown',
      riskAssessment: 'low',
      scamIndicators: [],
    };
  }
}

export async function getRiskExplanation(riskScore: number, context: string) {
  if (riskScore < 30) {
    return { explanation: 'The conversation appears to be safe. No significant risks detected.' };
  }
  
  try {
    const result = await explainRiskScore({
      riskScore,
      context,
    });
    return result;
  } catch (error) {
    console.error('Error in getRiskExplanation:', error);
    return { explanation: 'Could not generate an explanation at this time.' };
  }
}
