# Vercel Deploy

Deploy the repository root, not the nested `execusim/` copy.

## Required Environment Variables

- `NEXT_PUBLIC_INSFORGE_URL`
- `NEXT_PUBLIC_INSFORGE_ANON_KEY`
- `MINIMAX_API_KEY`

Use [.env.example](C:\Users\bomma\OneDrive\Desktop\agentmaster\.env.example) as the reference for local and Vercel values.

## Recommended Vercel Settings

- Framework preset: `Next.js`
- Root directory: repository root
- Install command: `npm install`
- Build command: `npm run build`

## Runtime Notes

- The simulation route runs on Node.js in [route.ts](C:\Users\bomma\OneDrive\Desktop\agentmaster\app\api\simulate\route.ts).
- The route exports `maxDuration = 60` because the LLM pipeline can take longer than a default short request.
- `vercel.json` is included for a predictable root-app deployment.

## Pre-Deploy Check

Run this locally before pushing:

```bash
npm run build
```
