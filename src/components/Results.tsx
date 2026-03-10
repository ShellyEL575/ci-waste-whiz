import { motion } from "framer-motion";
import { AnimatedNumber, formatCurrency } from "./AnimatedNumber";
import { COPY } from "@/config/defaults";
import FormulaPanel from "./FormulaPanel";
import SocialProof from "./SocialProof";
import FormulaTooltip from "./FormulaTooltip";

interface ResultsProps {
  results: ReturnType<typeof import("@/lib/calculations").calculateWaste>;
  inputs: Record<string, number>;
  onDownload: () => void;
  downloadComplete: boolean;
  firstName: string;
}

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  show: { transition: { staggerChildren: 0.15 } },
};

const Results = ({ results, inputs, onDownload, downloadComplete, firstName }: ResultsProps) => {
  return (
    <section id="results" className="py-16 px-4">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-10">
          <span className="cb-eyebrow mb-2 block">YOUR RESULTS</span>
          <h2 className="cb-section-heading mb-2">Here's What Inefficient CI Is Costing You</h2>
          <p className="text-base text-cb-muted">
            Based on your inputs and CloudBees Smart Tests production benchmarks.
          </p>
        </div>

        {/* 3.1 Current waste */}
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            {
              label: "ANNUAL TEST COMPUTE COST",
              value: results.annualTestComputeCost,
              sub: "Running full suites on every build",
              tooltip: `C1 × 12\n= $${inputs.C1?.toLocaleString()}/mo × 12\n= ${formatCurrency(results.annualTestComputeCost)}`,
            },
            {
              label: "TRIAGE LABOR (REAL BUGS)",
              value: results.realBugTriageCost,
              sub: "Engineers debugging real failures instead of shipping",
              tooltip: `D1 × (1−D3%) × D2 × 52 × A3\n= ${inputs.D1} × ${Math.round(100 - inputs.D3)}% × ${inputs.D2}h × 52wks × $${inputs.A3}/hr\n= ${formatCurrency(results.realBugTriageCost)}`,
            },
            {
              label: "FLAKY TESTS (LABOR + RERUNS)",
              value: results.totalFlakyCost,
              sub: "Investigation and reruns from failures with no real bug",
              tooltip: `(D1 × D3% × D2 × 52 × A3) + rerun compute\n= labor ${formatCurrency(results.flakeInvestigationCost)}\n+ compute ${formatCurrency(results.flakeRerunComputeCost)}\n= ${formatCurrency(results.totalFlakyCost)}`,
            },
          ].map((item) => (
            <motion.div key={item.label} variants={card} className="cb-card text-center relative">
              <FormulaTooltip content={item.tooltip} />
              <p className="cb-label text-xs mb-2">{item.label}</p>
              <AnimatedNumber value={item.value} className="cb-kpi text-cb-red" triggerOnView />
              <p className="text-xs text-cb-muted mt-2">{item.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Total waste */}
        <motion.div variants={card} initial="hidden" whileInView="show" viewport={{ once: true }} className="cb-card text-center mb-10 relative" style={{ background: "#1C0B0B" }}>
          <FormulaTooltip content={`Test Compute + Triage Labor + Flaky Tests\n= ${formatCurrency(results.annualTestComputeCost)}\n+ ${formatCurrency(results.realBugTriageCost)}\n+ ${formatCurrency(results.totalFlakyCost)}\n= ${formatCurrency(results.totalAnnualWaste)}`} />
          <p className="cb-label text-xs mb-2">TOTAL ANNUAL CI WASTE</p>
          <AnimatedNumber value={results.totalAnnualWaste} className="font-extrabold text-cb-red text-[36px] md:text-[56px]" triggerOnView />
          <p className="text-xs text-cb-muted mt-2">This grows 15–20% annually as your test suite expands.</p>
        </motion.div>




        {/* 3.3 Breakdown table */}
        <div className="cb-card mb-6 overflow-x-auto">
          <h3 className="text-lg font-bold text-cb-text mb-4">Full Breakdown</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cb-surface-2 text-cb-muted text-xs uppercase tracking-wider">
                <th className="text-left p-3">Category</th>
                <th className="text-right p-3">Current Annual Cost</th>
                <th className="text-right p-3">With Smart Tests</th>
                <th className="text-right p-3">Annual Savings</th>
                <th className="text-right p-3">Reduction</th>
              </tr>
            </thead>
            <tbody>
              {inputs.E1 > 0 && (
                <tr className="bg-cb-surface-2">
                  <td className="p-3 text-cb-text">Agentic Build Volume</td>
                  <td className="p-3 text-right text-cb-muted">{inputs.E1} builds/day ({results.agenticSharePercent}% of total)</td>
                  <td className="p-3 text-right text-cb-muted">Included in compute model</td>
                  <td className="p-3 text-right text-cb-muted">—</td>
                  <td className="p-3 text-right text-cb-muted">—</td>
                </tr>
              )}
              {[
                { cat: "Test Cloud Compute", cur: results.annualTestComputeCost, after: results.annualTestComputeCost * 0.5, saved: results.savedComputeCostPerYear, pct: "50%" },
                { cat: "Triage Labor (real bugs)", cur: results.realBugTriageCost, after: results.realBugTriageCost * 0.5, saved: results.savedRealBugTriage, pct: "50%" },
                { cat: "Flaky Tests (labor + reruns)", cur: results.totalFlakyCost, after: results.totalFlakyCost * 0.2, saved: results.savedFlakyCost, pct: "80%" },
              ].map((row, i) => (
                <tr key={row.cat} className={i % 2 === 0 ? "bg-cb-surface" : "bg-cb-surface-2"}>
                  <td className="p-3 text-cb-text">{row.cat}</td>
                  <td className="p-3 text-right text-cb-red">{formatCurrency(row.cur)}</td>
                  <td className="p-3 text-right text-cb-text">{formatCurrency(row.after)}</td>
                  <td className="p-3 text-right text-cb-green">{formatCurrency(row.saved)}</td>
                  <td className="p-3 text-right text-cb-text">{row.pct}</td>
                </tr>
              ))}
              <tr className="bg-cb-surface-2 font-bold text-base">
                <td className="p-3 text-cb-text">TOTAL</td>
                <td className="p-3 text-right text-cb-red">{formatCurrency(results.totalAnnualWaste)}</td>
                <td className="p-3 text-right text-cb-text">{formatCurrency(results.totalAnnualWaste - results.totalAnnualSavings)}</td>
                <td className="p-3 text-right text-cb-green">{formatCurrency(results.totalAnnualSavings)}</td>
                <td className="p-3 text-right text-cb-muted">—</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 3.3b Formula panel */}
        <FormulaPanel results={results} inputs={inputs} />

        {/* 3.4 Social proof */}
        <SocialProof />

        {/* 3.5 Download CTA */}
        <div
          className="cb-card text-center border-t-2 border-cb-purple py-12 mt-10"
          style={{ background: "radial-gradient(ellipse at center, rgba(107,92,231,0.08), transparent 70%)" }}
        >
          {downloadComplete ? (
            <>
              <h3 className="cb-section-heading mb-2">Thanks, {firstName}! Your report is downloading.</h3>
              <p className="text-sm text-cb-muted mb-6">A CloudBees team member may reach out to walk through your numbers.</p>
              <a href={COPY.demoURL} className="cb-btn-primary inline-block">Book Your Demo</a>
              <div className="mt-4">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: "CI Waste Calculator", url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="text-sm text-cb-purple hover:underline"
                >
                  Share the Calculator →
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="cb-section-heading mb-2">Download Your Personalized Report</h3>
              <p className="text-base text-cb-muted mb-6">
                We'll generate a personalized PDF with your numbers and benchmarks. Takes 30 seconds.
              </p>
              <button onClick={onDownload} className="cb-btn-primary text-lg !py-4 !px-10 mb-4">
                {COPY.resultsCTA}
              </button>
              <p className="text-xs text-cb-muted mb-4">
                No email required to see the results above — only for the downloadable PDF.
              </p>
              <a href={COPY.demoURL} className="text-sm text-cb-purple hover:underline">
                {COPY.demoCTA} →
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Results;
