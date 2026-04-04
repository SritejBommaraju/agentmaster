# Build Priority Order

Build in this sequence to always have something demo-able:

1. **UI shell** — Next.js app with 5 panels, empty state, layout ✅ Done
2. **Strategy agent** — MiniMax call, idea → ICP/pricing/messaging/hypothesis, render in Panel 2 ✅ Done
3. **Persona generator** — instantiate 3 personas, wire to simulation agent calls 🔲 Next
4. **Simulation loop** — Round 1 persona calls, render responses in Panel 3 🔲
5. **Executive supervisor** — aggregate Round 1, generate pivot, render in Panel 4 🔲
6. **Multi-round loop + scoring** — up to 3 rounds total, compute validation_score, render Panel 5 🔲
7. **Polish** — simulated streaming, animations, score color coding, demo flow 🔲

## Loop Spec (Updated 2026-04-04)

Original spec was 1 pivot loop. **Updated:** max 3 rounds, max 2 pivots.
- Round 1 → Supervisor evaluates → if pivot: Round 2
- Round 2 → Supervisor evaluates → if pivot: Round 3
- Round 3 (or earlier if no pivot) → Scoring Engine → final output
- If final score < 50% → "idea didn't validate" message + top objections summary

## Notes

- Steps 1–4 give you a working demo path (idea → strategy → personas → feedback)
- Steps 5–6 give you the full loop and the score for the pitch
- Step 7 is what makes it look like a real product

## Panel → Component Mapping

| Panel | Content | Agent |
|-------|---------|-------|
| 1 | Idea input + submit | User input |
| 2 | ICP, pricing, messaging, hypothesis | Strategy Agent |
| 3 | Persona cards with scores + objections | Simulation Agents (×3, ×2 rounds) |
| 4 | Pivot decision + rationale | Executive Supervisor |
| 5 | Validation score + breakdown | Scoring Engine |
