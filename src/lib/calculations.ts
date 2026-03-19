import { BENCHMARKS } from '../config/defaults';

export function calculateWaste(inputs: {
  A1: number; A2: number; A3: number;
  B1: number; B2: number; E1: number; B3: number; B4: number;
  C1: number;
  D1: number; D2: number; D3: number;
}) {
  const { A1, A2, A3, B1, B2, E1, B3, B4, C1, D1, D2, D3 } = inputs;
  const { computeSavingsRate, triageSavingsRate, flakeEliminationRate,
          workdaysPerYear, hoursPerSprintPerson } = BENCHMARKS;

  // ─── BUILD VOLUME ─────────────────────────────────────────
  const humanBuildsPerDay   = A1 * B2;
  const agenticBuildsPerDay = E1;
  const totalBuildsPerDay   = humanBuildsPerDay + agenticBuildsPerDay;
  const agenticSharePercent = totalBuildsPerDay > 0
    ? Math.round((agenticBuildsPerDay / totalBuildsPerDay) * 100) : 0;

  // ─── TEST COMPUTE COST ────────────────────────────────────
  const fullSuiteBuildsPerDay         = totalBuildsPerDay * (B3 / 100);
  const fullSuiteBuildsPerYear        = fullSuiteBuildsPerDay * workdaysPerYear;
  const totalBuildHoursPerYear        = (fullSuiteBuildsPerYear * B1) / 60;

  // baseline: 50 devs × 4 builds × 40% × 250 days = 20,000 builds/yr × 60 min
  const defaultB1                     = 60;
  const buildVolumeScale              = (fullSuiteBuildsPerYear * B1) / (20000 * defaultB1);

  const annualTestComputeCost = C1 * 12 * buildVolumeScale;

  // ─── CONFIDENCE RERUNS (B4) ───────────────────────────────
  const costPerBuildHour        = totalBuildHoursPerYear > 0
    ? annualTestComputeCost / totalBuildHoursPerYear : 0;
  const confidenceRerunsPerYear      = B4 * 52;
  const confidenceRerunHours         = (confidenceRerunsPerYear * B1) / 60;
  const confidenceRerunComputeCost   = confidenceRerunHours * costPerBuildHour;
  const confidenceRerunLaborCost     = confidenceRerunHours * A3;
  const confidenceRerunCost          = confidenceRerunComputeCost + confidenceRerunLaborCost;

  // ─── TRIAGE — REAL BUGS ONLY ──────────────────────────────
  // A2 (QA/SDET) are the primary investigators; scale triage headcount by total eng team
  const triageTeamScale         = (A1 + A2) / (50 + 10); // relative to defaults
  const nonFlakeFailuresPerWeek = D1 * (1 - D3 / 100);
  const realBugTriageHours      = nonFlakeFailuresPerWeek * D2 * 52 * triageTeamScale;
  const realBugTriageCost       = realBugTriageHours * A3;

  // ─── FLAKY TEST COST (labor + rerun compute) ──────────────
  const flakeFailuresPerWeek    = D1 * (D3 / 100);
  const flakeInvestigationHours = flakeFailuresPerWeek * D2 * 52 * triageTeamScale;
  const flakeInvestigationCost  = flakeInvestigationHours * A3;
  const flakeRerunHoursPerYear  = flakeFailuresPerWeek * 52 * (B1 / 60);
  const flakeRerunComputeCost   = flakeRerunHoursPerYear * costPerBuildHour;
  const totalFlakyCost          = flakeInvestigationCost + flakeRerunComputeCost;

  // ─── TOTAL WASTE ──────────────────────────────────────────
  const totalAnnualWaste = annualTestComputeCost + realBugTriageCost + totalFlakyCost + confidenceRerunCost;

  // ─── SAVINGS ──────────────────────────────────────────────
  const savedComputeCostPerYear = annualTestComputeCost * computeSavingsRate;
  const savedRealBugTriage      = realBugTriageCost     * triageSavingsRate;
  const savedFlakyCost          = totalFlakyCost        * flakeEliminationRate;
  const savedConfidenceReruns   = confidenceRerunCost   * computeSavingsRate;
  const totalAnnualSavings      = savedComputeCostPerYear + savedRealBugTriage + savedFlakyCost + savedConfidenceReruns;

  // ─── DISPLAY METRICS ──────────────────────────────────────
  const savedTriageHoursPerYear = Math.round(
    (realBugTriageHours      * triageSavingsRate) +
    (flakeInvestigationHours * flakeEliminationRate)
  );
  const savedBuildHoursPerYear  = Math.round(totalBuildHoursPerYear * computeSavingsRate);
  const featuresUnlocked        = Math.round(savedTriageHoursPerYear / hoursPerSprintPerson);

  return {
    annualTestComputeCost, realBugTriageCost, totalFlakyCost,
    flakeInvestigationCost, flakeRerunComputeCost, costPerBuildHour,
    confidenceRerunCost,
    totalAnnualWaste, savedComputeCostPerYear, savedRealBugTriage,
    savedFlakyCost, savedConfidenceReruns, totalAnnualSavings,
    savedTriageHoursPerYear, savedBuildHoursPerYear, featuresUnlocked,
    totalBuildsPerDay, agenticBuildsPerDay, agenticSharePercent,
    totalBuildHoursPerYear, realBugTriageHours, flakeInvestigationHours,
    buildVolumeScale,
  };
}
