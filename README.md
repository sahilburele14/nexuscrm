<<<<<<< HEAD
# nexuscrm
=======
# NexusCRM

A responsive Lead Management Dashboard built with React and TypeScript.

## Quick Start

1.  Open the application.
2.  Log in using the pre-filled demo credentials:
    *   **Email:** admin@nexus.com
    *   **Password:** password
3.  Explore the Dashboard, Filterable Lead Table, and Lead Detail views.

## Features

*   **Mock Backend:** A sophisticated service layer in `services/mockDb.ts` generates 500 dummy leads and simulates network latency, filtering, sorting, and pagination logic identical to a real MongoDB backend.
*   **Gemini Integration:** In the Lead Detail view, use the "AI Email Drafter" to generate context-aware outreach emails (Requires API Key or falls back to demo text).
*   **Charts:** Visual analytics using Recharts.

## Architecture

*   **Frontend:** React 18, TypeScript, Tailwind CSS.
*   **State:** Context API for Auth, Local state for data.
*   **Routing:** React Router (HashRouter).
>>>>>>> 45ab259 (Initial commit - NexusCRM frontend)
