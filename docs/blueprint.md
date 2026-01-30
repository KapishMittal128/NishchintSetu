# **App Name**: Nishchint Setu

## Core Features:

- Conversation Monitoring Activation: Allows users to activate real-time monitoring of conversations with clear permission requests and explanations.
- Continuous Audio Capture & Chunking: Continuously captures audio and segments it into rolling chunks for real-time processing.
- Real-Time Transcription Pipeline: Transcribes audio chunks into text in real-time, updating the full and rolling transcripts. Risk-related words are highlighted in the transcript.
- Multi-Layer Scam Analysis Engine: Uses deterministic keyword detection, temporal pattern correlation, and conversational intent analysis to identify potential scams. The conversational intent analysis will employ an LLM tool.
- Real-Time Risk Computation & Display: Continuously computes a risk score based on analysis, displaying the risk level via a color-coded meter and textual explanation.
- Active Protection Response: Switches the interface to emergency mode with a full-screen warning, audible alert, and disabled non-essential interactions when a dangerous risk level is reached.
- Assistive Intervention Engine: Detects user confusion based on interaction telemetry and offers non-intrusive, step-by-step assistance with UI highlighting and optional automatic navigation.

## Style Guidelines:

- Primary Tint (System Blue – Soft Variant): Color: `#73A5EB` (used sparingly). Purpose: Primary actions (Start Monitoring, Continue, Confirm), Active states. Usage rule: Never full-screen, Used as a tint, not a fill
- Background Surface (Frosted Glass White): Base: `#F6F9FF`. With translucency and blur (glass effect). Purpose: App background, Large containers. Should feel airy and weightless
- Accent / Attention Color (Subtle Alert Amber): Color: `#D68948`. Purpose: Warnings, Financial/scam-related emphasis. Usage rule: Only when attention is required, Never persistent
- Critical Alert Color (Soft Red, Not Aggressive): Desaturated red, used only in emergency states. Avoid harsh pure red tones
- Use frosted glass panels (blur + transparency). Cards and modals should: Slightly blur content behind them, Cast soft, diffused shadows. Avoid heavy borders. Depth should be communicated via: Blur, Elevation, Subtle shadows. This creates a VisionOS / iOS Control Center feel.
- Primary Typeface: Use a humanist sans-serif that feels system-native. Clean, rounded, high legibility. Font weight hierarchy must be clear
- Text Rules: Large base font size (elderly-friendly). Generous line spacing. No dense paragraphs. Prefer: Short sentences, One idea per line. Typography should feel calm, not instructional.
- Use simple, outline-based system icons. Rounded corners. High contrast. No decorative icons. Icons should feel functional and familiar, not playful.
- Generous padding everywhere. Clear separation between sections. Large touch targets. One primary action per screen. Avoid: Crowded screens, Multi-column layouts, Competing CTAs. Every screen should feel like it has room to breathe.
- Animations must be: Short, Smooth, Purposeful. Examples: Fade + slight scale when a card appears, Gentle progress animation for monitoring, Soft color transitions in risk meter. Never use: Bouncy animations, Sudden movements, Flashing elements. Motion should reduce anxiety, not increase it.
- Every interaction provides immediate but gentle feedback. Examples: Button press → subtle haptic / visual response, State change → smooth transition. No loud confirmations or aggressive alerts unless truly critical