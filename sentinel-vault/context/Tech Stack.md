# Tech Stack

## LLM

- **MiniMax** — powers all agents (Strategy Agent, Persona Agents, Executive Supervisor)

## Frontend

- **Next.js** — app framework and dashboard
- **Tailwind CSS** — styling
- **shadcn/ui** — component library
- **Simulated streaming** — fake real-time output for demo feel

## Backend

- **Simple orchestrator** — Node.js or Python script that coordinates agent calls sequentially
- No complex infra needed: linear pipeline per simulation run

## Storage

- **In-memory / JSON** — hackathon-grade, no database required for MVP
- State held per simulation session

## Out of Scope

- Real web scraping
- Real customer outreach
- Real data ingestion
- Database persistence (stretch only)
