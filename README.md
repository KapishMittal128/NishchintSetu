# Nishchint Setu

**Your bridge to safety. Real-time conversation monitoring to protect you from scams.**

Nishchint Setu is a web application built to provide real-time monitoring of conversations to detect and prevent potential financial scams, particularly targeting vulnerable individuals. It uses local, in-browser speech-to-text and risk analysis to ensure privacy and immediate feedback.

## Key Features

*   **Real-time Transcription**: Locally transcribes audio via the browser's Web Speech API.
*   **Local Risk Analysis**: Identifies scam-related keywords and calculates a risk score without sending data to a server.
*   **Instant Alerts**: Provides immediate visual feedback and alerts based on the detected risk level.
*   **Privacy-First**: No audio or conversation data leaves your device.
*   **Modern, Calm UI**: Designed with Apple's Human Interface Guidelines in mind to be reassuring and easy to use, especially for elderly users.

## Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/)
*   **UI Library**: [React](https://reactjs.org/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
*   **AI/ML**: In-browser Web Speech API

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later)
*   npm

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username_/nishchint-setu.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Run the development server
    ```sh
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Usage

1.  Navigate to the dashboard.
2.  Click "Start Monitoring".
3.  Click "Start Analysis" to begin a 3-second recording and analysis cycle.
4.  Review the live transcript and risk score.
