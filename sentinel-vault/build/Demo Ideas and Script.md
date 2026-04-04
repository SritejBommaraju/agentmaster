# Demo Ideas and Script

## Product Context Summary

ExecuSim is a B2B idea validation product, not a generic agent demo.

Core loop:
1. User enters a one-line B2B idea
2. Strategy agent generates ICP, pricing, messaging, and hypothesis
3. Three synthetic business buyers evaluate it by company stage:
   - Early-stage (1-20 employees)
   - Growth-stage (20-150 employees)
   - Mid-market (150-500 employees)
4. Executive supervisor identifies the real weakness
5. Product pivots once and re-simulates
6. Validation score is computed with heavier weighting on harder buyers

The strongest part of the product story is that the simulation is grounded in real buyer constraints:
- Early-stage cares about speed, low cost, low risk
- Growth-stage cares about ROI, integrations, team adoption
- Mid-market cares about security, procurement, implementation, and proof

## Best Demo Angles

### 1. The "Fast PMF Check" Demo

Best for: judges, founders, hackathon pitches

Story:
Turn a raw B2B idea into a go / refine / pivot signal in under a minute.

Why it works:
- Fastest path to understanding
- Shows the full product loop
- Makes the score feel meaningful instead of decorative

Suggested input:
"AI compliance automation tool for fintech"

### 2. The "Your ICP Is Wrong" Demo

Best for: product leaders, investors, startup operators

Story:
The idea is not bad, but the initial target segment is wrong. The supervisor catches that and retargets the pitch.

Why it works:
- Shows intelligence beyond summarization
- Makes the executive supervisor feel necessary
- Highlights that different buyer stages fail for different reasons

Suggested input:
"AI meeting notes and compliance tracker for finance teams"

Expected arc:
- Early-stage is interested
- Growth-stage is cautious
- Mid-market blocks on security and workflow fit
- Supervisor narrows ICP or changes positioning

### 3. The "Price vs Messaging" Demo

Best for: audiences who have seen many AI demos already

Story:
The first round fails for reasons that look like pricing, but the deeper issue is messaging and trust. The product distinguishes the two.

Why it works:
- Demonstrates nuance
- Prevents the product from looking like a trivial "just lower the price" tool

Suggested input:
"AI SDR copilot for small sales teams"

Expected arc:
- Founder says price is too high
- Growth buyer says ROI is unclear
- Mid-market says vendor credibility is weak
- Supervisor changes messaging first, then pricing tier

### 4. The "Boardroom Decision" Demo

Best for: polished final demo day presentation

Story:
ExecuSim acts like a miniature market and an executive team in one interface.

Why it works:
- Strongest premium framing
- Leans into the dark control-room UI
- Makes each panel feel like a decision surface

Suggested input:
"AI onboarding copilot for HR teams at scaling SaaS companies"

## Recommended Primary Demo

Use the compliance automation demo as the main scripted path.

Reason:
- It is already aligned with the vault's sample outputs
- Security and procurement objections are instantly legible to an audience
- The mid-market turnaround is easy to understand
- It cleanly showcases the weighted score logic

## Recommended Backup Demo

Use the "AI onboarding copilot for HR teams at scaling SaaS companies" as backup.

Reason:
- Broadly understandable
- Lets you show cross-stage differences clearly
- Easier to explain than niche fintech details if the room is mixed

## Live Demo Script

### 30-Second Version

"This is ExecuSim. Instead of spending weeks on customer discovery before you know if an idea has legs, we simulate a market of B2B buyers in under a minute. I enter an idea, our strategy agent turns it into an ICP, pricing, and messaging, then three buyers at different company stages react to it. An executive supervisor reads the objections, pivots the strategy once, and gives us a weighted validation score. The point is not to replace real customers. It's to tell you what to test next before you waste time building or selling the wrong thing."

### 2-Minute Script

"This is ExecuSim, an AI market simulation executive for B2B ideas.

I'll start with a one-line idea: 'AI compliance automation tool for fintech.'

As soon as I submit, the strategy agent converts that raw idea into a real go-to-market hypothesis: who the ICP is, how to price it, how to message it, and what assumption needs to be true for this business to work.

Next, ExecuSim generates three synthetic business buyers. These are not generic personas. They represent actual decision-makers at three company stages: an early-stage founder, a growth-stage operator, and a mid-market leader with procurement and security requirements.

Round one is where the interesting part happens. Each buyer reacts in their own language and with their own constraints. The founder wants low risk and instant setup. The growth-stage buyer asks for ROI and integrations. The mid-market buyer blocks on SOC 2, reference customers, and implementation risk.

Now the executive supervisor steps in. It looks across all three responses, identifies the biggest pattern, and decides whether the issue is pricing, messaging, ICP, or some combination. In this case, the product is aimed at mid-market buyers, but the pitch does not address how mid-market teams actually buy.

So ExecuSim pivots the strategy, re-runs the market, and shows us whether the idea became more credible.

In round two, the scores improve because the pitch now leads with security readiness, proof, and a better growth-tier offer.

Finally, we compute a weighted validation score. Mid-market feedback counts more heavily because that buyer is harder to win and represents more real revenue.

The output is not 'build this blindly.' The output is: here's the strongest objection, here's the better positioning, and here's whether this idea deserves real customer discovery."

### 5-Minute Script

#### 1. Open

"ExecuSim helps founders validate B2B ideas before they spend weeks on interviews, outreach, and product work. We simulate a market of AI buyers, let an AI executive iterate on the pitch, and return a signal on whether the idea is worth pursuing."

#### 2. Enter The Idea

"I'll use: 'AI compliance automation tool for fintech.' This is a good demo because compliance products live or die on trust, proof, and procurement friction."

#### 3. Strategy Panel

"The first panel turns a vague idea into a strategy artifact: ICP, pricing, messaging, and core hypothesis. That matters because most ideas fail before validation even starts. They're too broad, underpriced, or aimed at the wrong buyer."

#### 4. Persona Panel

"Now we simulate three buyer stages. This founder-stage buyer is fast, budget-sensitive, and wants a free trial. The growth-stage operator wants ROI they can defend and integrations that fit their stack. The mid-market leader is asking the hardest and most realistic questions: security, procurement, implementation, and referenceability."

#### 5. Executive Panel

"The supervisor is the key differentiator. It doesn't just summarize objections. It identifies which buyer exposed the deepest strategic flaw. Here, mid-market is the intended ICP, but the pitch does not satisfy mid-market buying criteria. That's a messaging and proof problem, not just a feature problem."

#### 6. Round Two

"ExecuSim then rewrites the go-to-market angle and re-runs the market. The audience can see the delta directly: early-stage improves a little, growth-stage improves on ROI clarity, and mid-market improves the most once security and proof are addressed."

#### 7. Score Panel

"The final score is weighted. Mid-market counts more than early-stage because winning a casual founder is not the same as surviving procurement at a larger company. So the score is designed to reflect business reality, not vanity engagement."

#### 8. Close

"The value here is speed and focus. ExecuSim does not replace customer interviews. It tells you what story to test, what objection will kill the deal, and whether your first pass is directionally credible before you spend the next two weeks on the wrong experiment."

## Demo Operator Notes

- Use a pre-cached scenario in case the live model is slow
- Keep the camera on the panel progression, not the raw text density
- Pause longest on the first objection set and the supervisor rationale
- Explicitly call out why the mid-market buyer matters most
- Say "synthetic buyers" and "decision-makers by stage" repeatedly; that is the product's identity
- Avoid describing the product as generic multi-agent orchestration

## Likely Audience Questions

### "Why not just talk to real customers?"

Answer:
"You still should. This is a front-end filter. It helps you pressure-test positioning and likely objections before you spend time recruiting interviews or building outbound infrastructure."

### "Why are the personas credible?"

Answer:
"They are anchored to real buying contexts by company stage, role, and constraints. The point is not demographic realism. The point is decision-making realism."

### "Why weight mid-market more heavily?"

Answer:
"Because harder buyers expose more of the real friction in B2B sales: security, procurement, implementation, and stakeholder alignment."

### "Is the score supposed to be definitive?"

Answer:
"No. It is a decision aid. The score is useful because it is tied to explicit objections, a visible pivot, and weighted buyer responses."
