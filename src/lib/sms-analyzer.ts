const SMS_KEYWORD_WEIGHTS: Record<string, number> = {
  // High risk
  'prize': 20, 'winner': 20, 'claim': 15, 'congratulations': 15, 'won': 15,
  'account suspended': 25, 'locked': 25, 'security alert': 20, 'unusual activity': 20,
  'verify your account': 20, 'update payment': 15, 'confirm your identity': 20,
  'tax refund': 20, 'irs': 15, 'revenue service': 15,
  
  // Medium risk
  'link': 10, 'click here': 10, 'bit.ly': 15, 'goo.gl': 15, 'shorturl.at': 15, 'tinyurl': 15,
  'urgent': 10, 'act now': 10, 'limited time': 10, 'final notice': 15, 'immediately': 10,
  'password': 10, 'username': 5, 'login': 5, 'otp': 25, 'code': 10,
  'delivery': 5, 'package': 5, 'shipping': 5, 'fee': 10,

  // Lower risk but can be in scams
  'free': 5, 'offer': 5, 'deal': 5, 'discount': 5, 'money': 5
};

const URGENT_KEYWORDS = ['urgent', 'act now', 'today only', 'expires', 'final notice', 'immediately', 'limited time'];
const THREATENING_KEYWORDS = ['suspicious', 'locked', 'suspended', 'arrest', 'legal action', 'police', 'fraud alert', 'problem with your account', 'compromised'];

type AnalysisResult = {
  riskScore: number;
  sentiment: 'calm' | 'urgent' | 'threatening';
};

export function analyzeSms(body: string): AnalysisResult {
  const lowerBody = body.toLowerCase();
  let riskScore = 0;
  let sentiment: AnalysisResult['sentiment'] = 'calm';

  // Calculate Risk Score
  for (const keyword in SMS_KEYWORD_WEIGHTS) {
    if (lowerBody.includes(keyword)) {
      riskScore += SMS_KEYWORD_WEIGHTS[keyword];
    }
  }

  // A simple check for URLs, which are common in phishing
  if (/https?:\/\//.test(lowerBody)) {
    riskScore += 10;
  }
  
  const finalScore = Math.min(100, riskScore);

  // Determine Sentiment (Threatening takes precedence over Urgent)
  if (THREATENING_KEYWORDS.some(keyword => lowerBody.includes(keyword))) {
    sentiment = 'threatening';
  } else if (URGENT_KEYWORDS.some(keyword => lowerBody.includes(keyword))) {
    sentiment = 'urgent';
  }

  return { riskScore: finalScore, sentiment };
}
