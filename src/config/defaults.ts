// src/config/defaults.ts

export const INPUTS = {
  A1: { default: 50,    min: 5,    max: 5000,   step: 5,   label: "Engineers who commit code" },
  A2: { default: 10,    min: 1,    max: 500,    step: 1,   label: "QA / SDET engineers" },
  A3: { default: 75,    min: 40,   max: 250,    step: 5,   label: "Hourly engineer cost (USD)" },
  B1: { default: 60,    min: 5,    max: 480,    step: 5,   label: "Full test suite runtime (minutes)" },
  B2: { default: 4,     min: 1,    max: 20,     step: 1,   label: "CI builds per developer per day" },
  E1: { default: 0,     min: 0,    max: 500,    step: 1,   label: "AI agent-generated CI builds per day" },
  B3: { default: 40,    min: 5,    max: 100,    step: 5,   label: "% of builds running full suite" },
  C1: { default: 5200,  min: 300,  max: 130000, step: 300, label: "Monthly CI cloud spend on test execution (USD)" },
  D1: { default: 15,    min: 1,    max: 200,    step: 1,   label: "Failure investigations per week" },
  D2: { default: 3,     min: 0.5,  max: 24,     step: 0.5, label: "Hours to triage one failure" },
  D3: { default: 35,    min: 0,    max: 80,     step: 5,   label: "% of failures that are flaky" },
} as const;

export const BENCHMARKS = {
  computeSavingsRate:   0.50,
  triageSavingsRate:    0.50,
  flakeEliminationRate: 0.80,
  workdaysPerYear:      250,
  hoursPerSprintPerson: 160,
} as const;

export const COPY = {
  heroCTA:        "Calculate My CI Waste →",
  resultsCTA:     "Download My PDF Report",
  demoCTA:        "Book a Free 30-Min Demo",
  demoURL:        "#",
  emailBlockList: ["gmail","yahoo","hotmail","outlook","icloud","me","mac"],
} as const;
