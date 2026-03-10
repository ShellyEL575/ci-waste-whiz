import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "./AnimatedNumber";

interface FormulaPanelProps {
  results: Record<string, number>;
  inputs: Record<string, number>;
}

const FormulaPanel = ({ results, inputs }: FormulaPanelProps) => {
  const [open, setOpen] = useState(false);

  const blocks = [
    {
      label: "TOTAL CI BUILD VOLUME / DAY",
      formula: "totalBuildsPerDay = (A1 × B2) + E1",
      live: `= (${inputs.A1} × ${inputs.B2}) + ${inputs.E1} = ${results.totalBuildsPerDay} builds/day`,
      source: "Inputs: A1 (engineers), B2 (builds/dev/day), E1 (agentic builds)",
    },
    {
      label: "ANNUAL TEST COMPUTE COST",
      formula: "annualTestComputeCost = C1 × 12",
      live: `= $${inputs.C1?.toLocaleString()} × 12 = ${formatCurrency(results.annualTestComputeCost)}`,
      source: "Inputs: C1 (monthly test compute spend)",
    },
    {
      label: "TRIAGE LABOR (REAL BUGS ONLY)",
      formula: "realBugTriageCost = D1 × (1 − D3%) × D2 × 52 × A3",
      live: `= ${inputs.D1} × ${Math.round(100 - inputs.D3)}% × ${inputs.D2}h × 52wks × $${inputs.A3}/hr = ${formatCurrency(results.realBugTriageCost)}`,
      source: "Inputs: D1 (failures/week), D3 (flake rate), D2 (hours/failure), A3 (hourly cost)",
    },
    {
      label: "FLAKY TEST COST (LABOR + COMPUTE)",
      formula: "totalFlakyCost = (D1 × D3% × D2 × 52 × A3) + (flakeRerunHours × costPerBuildHour)",
      live: `= labor ${formatCurrency(results.flakeInvestigationCost)} + rerun compute ${formatCurrency(results.flakeRerunComputeCost)} = ${formatCurrency(results.totalFlakyCost)}`,
      source: "80% eliminated when Smart Tests identifies and quarantines flaky tests.",
    },
    {
      label: "SAVINGS PROJECTION BASIS",
      formula: "50% compute reduction · 50% triage reduction · 80% flaky test elimination",
      live: `savedCompute = ${formatCurrency(results.annualTestComputeCost)} × 50% = ${formatCurrency(results.savedComputeCostPerYear)}\nsavedTriage = ${formatCurrency(results.realBugTriageCost)} × 50% = ${formatCurrency(results.savedRealBugTriage)}\nsavedFlaky = ${formatCurrency(results.totalFlakyCost)} × 80% = ${formatCurrency(results.savedFlakyCost)}`,
      source: "Benchmarks from src/config/defaults.ts — BENCHMARKS object.\nRates are conservative medians from CloudBees Smart Tests production deployments.",
    },
  ];

  return (
    <div className="mb-10">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs text-cb-muted uppercase tracking-[0.08em] hover:text-cb-text transition-colors mb-2"
      >
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
          ▶
        </motion.span>
        How these numbers are calculated
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-cb-surface-2 border border-cb-border rounded-lg p-5 space-y-4">
              {blocks.map((block) => (
                <div key={block.label} className="bg-cb-bg border border-cb-border rounded-md p-4">
                  <p className="text-[10px] text-cb-purple uppercase tracking-wider mb-2">{block.label}</p>
                  <p className="text-cb-text text-[13px] font-mono mb-1">{block.formula}</p>
                  {block.live.split("\n").map((line, i) => (
                    <p key={i} className="text-cb-green text-xs font-mono">{line}</p>
                  ))}
                  {block.source.split("\n").map((line, i) => (
                    <p key={i} className="text-cb-muted text-[11px] italic mt-1">{line}</p>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormulaPanel;
