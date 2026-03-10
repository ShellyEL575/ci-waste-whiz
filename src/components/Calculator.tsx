import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SliderInput from "./SliderInput";
import { INPUTS } from "@/config/defaults";

type InputKey = keyof typeof INPUTS;

interface CalculatorInputs {
  A1: number;A2: number;A3: number;
  B1: number;B2: number;E1: number;B3: number;B4: number;
  C1: number;
  D1: number;D2: number;D3: number;
}

interface CalculatorProps {
  values: CalculatorInputs;
  onChange: (key: InputKey, value: number) => void;
  agenticSharePercent: number;
  totalAnnualWaste: number;
  advancedOpened: boolean;
  onAdvancedOpened: () => void;
}

const helpers: Record<InputKey, string> = {
  A1: "All devs committing to repos with CI pipelines",
  A2: "Dedicated QA, SDET, and automation engineers",
  A3: "Blended salary + benefits + overhead. Industry median: $75–$95/hr",
  B1: "End-to-end time for one complete suite run. Industry median: 45–90 min",
  B2: "Commits, PRs, and retries. Typical range: 3–6",
  E1: "Builds triggered by AI coding agents (e.g. Claude Code, Copilot Workspace, Cursor, Devin). Default: 0",
  B3: "What % of your builds run the complete suite rather than a subset?",
  B4: "Full-suite reruns triggered manually for confidence — not by a failure. Conservative: 2–5/week",
  C1: "Your monthly cloud runner spend that goes specifically to running tests (GitHub Actions, CircleCI, Jenkins agents, etc.). Typical: $2k–$15k/mo",
  D1: "How many CI failures require a human to investigate each week?",
  D2: "Time from alert to root cause. Often longer than teams estimate.",
  D3: "Failures with no code change — infrastructure noise, timing, environment. Industry: 25–45%"
};

const badgeFormats: Record<InputKey, (v: number) => string> = {
  A1: (v) => `${v} engineers`,
  A2: (v) => `${v} engineers`,
  A3: (v) => `$${v}/hr`,
  B1: (v) => `${v} min`,
  B2: (v) => `${v} builds/dev/day`,
  E1: (v) => `${v} agentic builds/day`,
  B3: (v) => `${v}%`,
  B4: (v) => `${v}/week`,
  C1: (v) => `$${v.toLocaleString()}/mo`,
  D1: (v) => `${v}/week`,
  D2: (v) => `${v} hrs`,
  D3: (v) => `${v}%`
};

const Calculator = ({ values, onChange, agenticSharePercent, totalAnnualWaste, advancedOpened, onAdvancedOpened }: CalculatorProps) => {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const handleAdvancedToggle = () => {
    const next = !advancedOpen;
    setAdvancedOpen(next);
    if (next && !advancedOpened) {
      onAdvancedOpened();
    }
  };

  const renderSlider = (key: InputKey) =>
  <SliderInput
    key={key}
    label={INPUTS[key].label}
    value={values[key]}
    min={INPUTS[key].min}
    max={INPUTS[key].max}
    step={INPUTS[key].step}
    helper={helpers[key]}
    formatBadge={badgeFormats[key]}
    onChange={(v) => onChange(key, v)} />;



  return (
    <section id="calculator" className="py-16 px-4">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-10">
          <span className="cb-eyebrow text-[11px] tracking-[0.1em] mb-2 block">STEP 1 OF 2</span>
          <h2 className="cb-section-heading mb-2">Tell Us About Your Team and Testing Habits</h2>
          <p className="text-base text-cb-muted">
            All values are editable. Defaults are industry benchmarks — adjust to match your environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card A */}
          <div className="cb-card" id="card-a">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span>👥</span>
                <span className="cb-label text-xs">A — TEAM PROFILE</span>
              </div>
              <p className="text-xs text-cb-muted">Who's building and shipping?</p>
            </div>
            {renderSlider("A1")}
            {renderSlider("A2")}
            {renderSlider("A3")}
          </div>

          {/* Card B */}
          <div className="cb-card" id="card-b">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span>⚙️</span>
                <span className="cb-label text-xs">B — CI BUILD PROFILE</span>
              </div>
              <p className="text-xs text-cb-muted">How does your pipeline behave?</p>
            </div>
            {renderSlider("B1")}
            {renderSlider("B2")}

            {/* Advanced Settings disclosure */}
            <div className="mt-2">
              <button
                onClick={handleAdvancedToggle}
                className="flex items-center gap-2 text-xs text-cb-muted hover:text-cb-text transition-colors">
                
                <motion.span animate={{ rotate: advancedOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  ▶
                </motion.span>
                Advanced — pipeline settings
              </button>
              <AnimatePresence>
                {advancedOpen &&
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden">
                  
                    <div className="bg-cb-surface-2 rounded-lg p-3 mt-2 space-y-1">
                      {renderSlider("E1")}
                      {values.E1 > 0 &&
                    <div className="bg-cb-surface-2 border-l-[3px] border-cb-purple p-2.5 rounded-r mb-4 text-xs text-cb-muted">
                          Agentic builds account for <strong className="text-cb-purple">{agenticSharePercent}%</strong> of your total daily build volume.
                          This multiplies CI pressure — and Smart Tests scale linearly with it.
                        </div>
                    }
                      {renderSlider("B3")}
                      {renderSlider("B4")}
                    </div>
                  </motion.div>
                }
              </AnimatePresence>
            </div>
          </div>

          {/* Card C */}
          <div className="cb-card" id="card-c">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span>☁️</span>
                <span className="cb-label text-xs">C — CLOUD COMPUTE</span>
              </div>
              <p className="text-xs text-cb-muted">What does your CI infrastructure cost?</p>
            </div>
            {renderSlider("C1")}
          </div>

          {/* Card D */}
          <div className="cb-card" id="card-d">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span>🔍</span>
                <span className="cb-label text-xs">D — TRIAGE AND FAILURES</span>
              </div>
              <p className="text-xs text-cb-muted">What does debugging CI failures actually cost?</p>
            </div>
            {renderSlider("D1")}
            {renderSlider("D2")}
            {renderSlider("D3")}
          </div>
        </div>

        {/* Live waste ticker */}
        <div className="mt-6 bg-cb-surface-2 border-t border-b border-cb-border py-5 px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-cb-muted uppercase tracking-wider text-lg">ESTIMATED ANNUAL WASTE

          </span>
          <span className="text-cb-red font-extrabold text-4xl">
            ${Math.round(totalAnnualWaste).toLocaleString("en-US")}
          </span>
        </div>


      </div>
    </section>);

};

export default Calculator;