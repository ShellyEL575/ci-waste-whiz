import { BENCHMARKS } from '../config/defaults';

export function calculateWaste(inputs: {
  A1: number; A2: number; A3: number;
  B1: number; B2: number; E1: number; B3: number; B4: number;
  C1: number;
  D1: number; D2: number; D3: number;
}) {
  const { A1, A3, B1, B2, E1, B3, C1, D1, D2, D3 } = inputs;
  const { computeSavingsRate, triageSavingsRate, flakeEliminationRate,
          workdaysPerYear, hoursPerSprintPerson } = BENCHMARKS;

  // ─── BUILD VOLUME ─────────────────────────────────────────
  const humanBuildsPerDay   = A1 * B2;
  const agenticBuildsPerDay = E1;
  const totalBuildsPerDay   = humanBuildsPerDay + agenticBuildsPerDay;
  const agenticSharePercent = totalBuildsPerDay > 0
    ? Math.round((agenticBuildsPerDay / totalBuildsPerDay) * 100) : 0;

  // ─── TEST COMPUTE COST ────────────────────────────────────
  // Scale C1 proportionally to actual full-suite build volume vs. default baseline
  const fullSuiteBuildsPerDay         = totalBuildsPerDay * (B3 / 100);
  const fullSuiteBuildsPerYear        = fullSuiteBuildsPerDay * workdaysPerYear;
  const totalBuildHoursPerYear        = (fullSuiteBuildsPerYear * B1) / 60;

  const defaultFullSuiteBuildsPerDay  = (50 * 4 + 0) * (40 / 100); // A1=50, B2=4, E1=0, B3=40%
  const defaultFullSuiteBuildsPerYear = defaultFullSuiteBuildsPerDay * workdaysPerYear;
  const buildVolumeScale              = defaultFullSuiteBuildsPerYear > 0
    ? fullSuiteBuildsPerYear / defaultFullSuiteBuildsPerYear : 1;

  const annualTestComputeCost = C1 * 12 * buildVolumeScale;

  // ─── TRIAGE — REAL BUGS ONLY ──────────────────────────────
  const nonFlakeFailuresPerWeek = D1 * (1 - D3 / 100);
  const realBugTriageHours      = nonFlakeFailuresPerWeek * D2 * 52;
  const realBugTriageCost       = realBugTriageHours * A3;

  // ─── FLAKY TEST COST (labor + rerun compute) ──────────────
  const flakeFailuresPerWeek    = D1 * (D3 / 100);
  const flakeInvestigationHours = flakeFailuresPerWeek * D2 * 52;
  const flakeInvestigationCost  = flakeInvestigationHours * A3;
  const flakeRerunHoursPerYear  = flakeFailuresPerWeek * 52 * (B1 / 60);
  const costPerBuildHour        = totalBuildHoursPerYear > 0
    ? annualTestComputeCost / totalBuildHoursPerYear : 0;
  const flakeRerunComputeCost   = flakeRerunHoursPerYear * costPerBuildHour;
  const totalFlakyCost          = flakeInvestigationCost + flakeRerunComputeCost;

  // ─── TOTAL WASTE ──────────────────────────────────────────
  const totalAnnualWaste = annualTestComputeCost + realBugTriageCost + totalFlakyCost;

  // ─── SAVINGS ──────────────────────────────────────────────
  const savedComputeCostPerYear = annualTestComputeCost * computeSavingsRate;
  const savedRealBugTriage      = realBugTriageCost     * triageSavingsRate;
  const savedFlakyCost          = totalFlakyCost        * flakeEliminationRate;
  const totalAnnualSavings      = savedComputeCostPerYear + savedRealBugTriage + savedFlakyCost;

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
    totalAnnualWaste, savedComputeCostPerYear, savedRealBugTriage,
    savedFlakyCost, totalAnnualSavings,
    savedTriageHoursPerYear, savedBuildHoursPerYear, featuresUnlocked,
    totalBuildsPerDay, agenticBuildsPerDay, agenticSharePercent,
    totalBuildHoursPerYear, realBugTriageHours, flakeInvestigationHours,
    buildVolumeScale,
  };
}
