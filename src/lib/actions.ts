
'use server';

/**
 * This file previously contained server actions for AI-based transcription and analysis.
 * This functionality has been moved to the client-side for local processing
 * in src/app/monitoring/monitoring-client.tsx.
 *
 * The original functions are kept here as no-ops to prevent breaking
 * other parts of the application if they were imported elsewhere.
 */

export async function getRiskAnalysis(conversationHistory: string, currentTurn: string) {
  console.warn('getRiskAnalysis is a no-op in local mode.');
  return {
    intent: 'unknown',
    sentiment: 'unknown',
    riskAssessment: 'low',
    scamIndicators: [],
  };
}

export async function getRiskExplanation(riskScore: number, context: string) {
  console.warn('getRiskExplanation is a no-op in local mode.');
  return { explanation: 'Local processing enabled. No remote explanation available.' };
}

export async function getTranscription(audioDataUri: string) {
  console.warn('getTranscription is a no-op in local mode.');
  return '';
}
