# Validation Scoring

## Formula

```
validation_score = avg(likelihood) * 0.6 + adoption_rate * 0.4
```

Where:
- `avg(likelihood)` = weighted average of per-persona likelihood scores from Round 2
- `adoption_rate` = % of personas with `interest_score >= 6`

## Persona Weights

| Persona | Weight |
|---------|--------|
| enterprise_buyer | 1.5x |
| skeptical_buyer | 1.2x |
| early_adopter | 1.0x |
| budget_buyer | 1.0x |

## Weighted Average Calculation

```
weighted_avg_likelihood =
  sum(persona.likelihood * persona.weight)
  / sum(persona.weight)
```

## Example Calculation

Round 2 persona likelihoods:
- Skeptical buyer: 0.45 (weight 1.2)
- Budget buyer: 0.60 (weight 1.0)
- Early adopter: 0.80 (weight 1.0)

```
weighted_avg = (0.45*1.2 + 0.60*1.0 + 0.80*1.0) / (1.2 + 1.0 + 1.0)
             = (0.54 + 0.60 + 0.80) / 3.2
             = 1.94 / 3.2
             = 0.606

adoption_rate = 2/3 personas scored >= 6  →  0.67

validation_score = 0.606 * 0.6 + 0.67 * 0.4
                 = 0.364 + 0.268
                 = 0.632  →  63%
```

## Score Interpretation

| Score | Meaning |
|-------|---------|
| 75–100% | Strong signal — proceed to customer discovery |
| 50–74% | Weak signal — needs pricing or positioning refinement |
| 0–49% | No signal — pivot idea or target segment |

## UI Display

- Large number in Panel 5 with % sign
- Color: green (≥75%), yellow (50–74%), red (<50%)
- Show breakdown: weighted likelihood, adoption rate, pivot count
- Secondary: per-persona score delta from Round 1 → Round 2
