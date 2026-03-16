# CI Waste Calculator — Formulas & Logic

## Inputs

| Key | Label | Default | Min | Max |
|-----|-------|---------|-----|-----|
| A1 | Engineers who commit code | 50 | 5 | 5000 |
| A2 | QA / SDET engineers (UI only, not used in calc) | 10 | 1 | 500 |
| A3 | Hourly engineer cost (USD) | $75 | $40 | $250 |
| B1 | Full test suite runtime (minutes) | 60 | 5 | 480 |
| B2 | CI builds per developer per day | 4 | 1 | 20 |
| E1 | AI agent-generated CI builds per day | 0 | 0 | 500 |
| B3 | % of builds running full suite | 40% | 5% | 100% |
| B4 | Manual "rerun to be safe" builds per week (UI only, not used in calc) | 3 | 0 | 50 |
| C1 | Monthly CI cloud spend on test execution (USD) | $5,200 | $300 | $130,000 |
| D1 | Failure investigations per week | 15 | 1 | 200 |
| D2 | Hours to triage one failure | 3h | 0.5h | 24h |
| D3 | % of failures that are flaky | 35% | 0% | 80% |

---

## Benchmarks (conservative medians from production deployments)

| Name | Value |
|------|-------|
| `computeSavingsRate` | 50% |
| `triageSavingsRate` | 50% |
| `flakeEliminationRate` | 80% |
| `workdaysPerYear` | 250 |
| `hoursPerSprintPerson` | 160 |

---

## Build Volume

```
humanBuildsPerDay   = A1 × B2
agenticBuildsPerDay = E1
totalBuildsPerDay   = humanBuildsPerDay + agenticBuildsPerDay
agenticSharePercent = (agenticBuildsPerDay / totalBuildsPerDay) × 100
```

---

## Test Compute Cost

`C1` is the user's reported monthly spend at the **default** volume. It is scaled proportionally to actual full-suite build volume vs. the baseline (A1=50, B2=4, E1=0, B3=40%).

```
fullSuiteBuildsPerDay         = totalBuildsPerDay × (B3 / 100)
fullSuiteBuildsPerYear        = fullSuiteBuildsPerDay × 250

totalBuildHoursPerYear        = (fullSuiteBuildsPerYear × B1) / 60

defaultFullSuiteBuildsPerDay  = (50 × 4 + 0) × (40 / 100) = 80
defaultFullSuiteBuildsPerYear = defaultFullSuiteBuildsPerDay × 250 = 20,000

buildVolumeScale              = fullSuiteBuildsPerYear / defaultFullSuiteBuildsPerYear

annualTestComputeCost         = C1 × 12 × buildVolumeScale
```

---

## Triage Labor — Real Bugs Only

```
nonFlakeFailuresPerWeek = D1 × (1 − D3 / 100)

realBugTriageHours      = nonFlakeFailuresPerWeek × D2 × 52
realBugTriageCost       = realBugTriageHours × A3
```

---

## Flaky Test Cost (Labor + Compute)

```
flakeFailuresPerWeek      = D1 × (D3 / 100)

flakeInvestigationHours   = flakeFailuresPerWeek × D2 × 52
flakeInvestigationCost    = flakeInvestigationHours × A3

flakeRerunHoursPerYear    = flakeFailuresPerWeek × 52 × (B1 / 60)
costPerBuildHour          = annualTestComputeCost / totalBuildHoursPerYear
flakeRerunComputeCost     = flakeRerunHoursPerYear × costPerBuildHour

totalFlakyCost            = flakeInvestigationCost + flakeRerunComputeCost
```

---

## Total Annual Waste

```
totalAnnualWaste = annualTestComputeCost
                 + realBugTriageCost
                 + totalFlakyCost
```

---

## Savings Projections

```
savedComputeCostPerYear = annualTestComputeCost × 50%
savedRealBugTriage      = realBugTriageCost     × 50%
savedFlakyCost          = totalFlakyCost        × 80%

totalAnnualSavings      = savedComputeCostPerYear
                        + savedRealBugTriage
                        + savedFlakyCost
```

---

## Display Metrics

```
savedTriageHoursPerYear = round(
  realBugTriageHours      × 50%  +
  flakeInvestigationHours × 80%
)

savedBuildHoursPerYear  = round(totalBuildHoursPerYear × 50%)

featuresUnlocked        = round(savedTriageHoursPerYear / 160)
```

> `featuresUnlocked` estimates how many sprint-person slots are reclaimed (1 sprint-person = 160 engineering hours).
