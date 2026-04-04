# Demo Scenario

**User Input:** "AI compliance automation tool for fintech"

## Step-by-Step

| Step | What Happens | UI Shows |
|------|-------------|----------|
| 1 | User submits idea | Panel 1 — idea locked in |
| 2 | Strategy Agent runs | Panel 2 — ICP (mid-market fintech ops teams), pricing ($500/mo/seat), messaging, hypothesis |
| 3 | 3 business buyer personas instantiated | Panel 3 — stage cards appear: Early-Stage, Growth-Stage, Mid-Market |
| 4 | Round 1 simulation | Panel 3 — scores and objections populate per stage |
| 5 | Executive Supervisor runs | Panel 4 — identifies Mid-Market concern (no SOC 2 mentioned), pivots messaging + pricing |
| 6 | Round 2 simulation | Panel 3 — updated scores appear across all stages |
| 7 | Scoring engine runs | Panel 5 — **72% Validation Score** |

## Round 1 — Sample Persona Responses

**Stage 1 (Early-Stage Founder):**
> interest_score: 6 | "Looks useful but $500/mo is too steep for us right now. Is there a free trial? Also — are you SOC 2 compliant? Our investors will ask."

**Stage 2 (Growth-Stage Head of Ops):**
> interest_score: 5 | "The ROI story isn't tight enough for me to take to my CFO. How does this integrate with our existing compliance stack? And what does implementation actually look like — be honest."

**Stage 3 (Mid-Market Director):**
> interest_score: 3 | "We can't even start a conversation without SOC 2 Type II. Legal will not approve a vendor without it. Also — who are your reference customers at our scale?"

## Supervisor Pivot Decision

> "Mid-market is the stated ICP but the pitch doesn't address their actual buying requirements — compliance certification and reference customers. Growth-stage needs a sharper ROI number. Pivot: lead messaging with SOC 2 compliance, add a case study reference, restructure pricing to include a growth tier at $299/mo."

## Round 2 — Sample Improvement

| Stage | Round 1 Score | Round 2 Score | Key Change |
|-------|--------------|--------------|------------|
| Early-Stage | 6/10 | 7/10 | Free trial added |
| Growth-Stage | 5/10 | 6/10 | ROI framing sharpened |
| Mid-Market | 3/10 | 6/10 | SOC 2 + reference customers addressed |

## What the Audience Sees

1. Idea typed → strategy generated in seconds
2. Three business buyers at different stages push back with authentic, stage-specific concerns
3. AI executive reads the objections, identifies the ICP-message mismatch
4. Second round shows measurable score improvement per stage
5. Final weighted score gives a concrete go/no-go signal

## Talking Points

- "These aren't random outputs — each persona embodies how buyers at that company stage actually talk and think"
- "The Stage 3 mid-market buyer killed it on compliance — that's the most common real B2B blocker"
- "The supervisor didn't just lower the price — it identified a messaging gap specific to the ICP"
- "The validation score weights mid-market buyers 1.5x because that's where the real ACV is"
- "This entire loop runs in under 60 seconds with MiniMax"

## Fallback (if LLM is slow)

- Pre-cache Round 1 and Round 2 responses for the compliance tool demo idea
- Stream them with a fake typewriter effect per panel for visual impact
