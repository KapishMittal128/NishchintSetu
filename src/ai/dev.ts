import { config } from 'dotenv';
config();

import '@/ai/flows/explain-risk-score.ts';
import '@/ai/flows/summarize-conversation-for-review.ts';
import '@/ai/flows/analyze-conversation-intent.ts';
import '@/ai/flows/transcribe-audio.ts';
import '@/ai/flows/get-safety-tip.ts';
