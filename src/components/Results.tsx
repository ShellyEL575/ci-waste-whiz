import { motion } from "framer-motion";
import { AnimatedNumber, formatCurrency } from "./AnimatedNumber";
import FormulaTooltip from "./FormulaTooltip";

interface ResultsProps {
  results: ReturnType<typeof import("@/lib/calculations").calculateWaste>;
  inputs: Record<string, number>;
}

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const stagger = {
  show: { transition: { staggerChildren: 0.15 } }
};

const Results = ({ results, inputs }: ResultsProps) => {
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
            tooltip: `Monthly CI spend × 12 months\n= $${inputs.C1?.toLocaleString()}/mo × 12\n= ${formatCurrency(results.annualTestComputeCost)}`
          },
          {
            label: "TRIAGE LABOR (REAL BUGS)",
            value: results.realBugTriageCost,
            sub: "Engineers debugging real failures instead of shipping",
            tooltip: `Failures/wk × Real bug rate × Triage hours × 52 wks × Hourly rate\n= ${inputs.D1} failures × ${Math.round(100 - inputs.D3)}% real × ${inputs.D2}h triage × 52 wks × $${inputs.A3}/hr\n= ${formatCurrency(results.realBugTriageCost)}`
          },
          {
            label: "FLAKY TESTS (LABOR + RERUNS)",
            value: results.totalFlakyCost,
            sub: "Investigation and reruns from failures with no real bug",
            tooltip: `Flaky investigation labor + Rerun compute\n= ${formatCurrency(results.flakeInvestigationCost)} labor\n+ ${formatCurrency(results.flakeRerunComputeCost)} reruns\n= ${formatCurrency(results.totalFlakyCost)} total`
          }].
          map((item) =>
          <motion.div key={item.label} variants={card} className="cb-card text-center relative">
              <FormulaTooltip content={item.tooltip} />
              <p className="cb-label text-xs mb-2">{item.label}</p>
              <AnimatedNumber value={item.value} className="cb-kpi text-cb-red" triggerOnView />
              <p className="text-xs text-cb-muted mt-2">{item.sub}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Total waste */}
        <motion.div variants={card} initial="hidden" whileInView="show" viewport={{ once: true }} className="cb-card text-center mb-10 relative" style={{ background: "#1C0B0B" }}>
          <FormulaTooltip content={`Compute + Triage labor + Flaky test costs\n= ${formatCurrency(results.annualTestComputeCost)} compute\n+ ${formatCurrency(results.realBugTriageCost)} triage\n+ ${formatCurrency(results.totalFlakyCost)} flaky tests\n= ${formatCurrency(results.totalAnnualWaste)} total`} />
          <p className="cb-label text-xs mb-2">TOTAL ANNUAL CI WASTE</p>
          <AnimatedNumber value={results.totalAnnualWaste} className="font-extrabold text-cb-red text-[36px] md:text-[56px]" triggerOnView />
          <p className="text-xs text-cb-muted mt-2">This grows 15–20% annually as your test suite expands.</p>
        </motion.div>











        {/* Growth CTA */}
        <motion.div
          variants={card}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-xl border border-border mt-10"
          style={{
            background: "radial-gradient(ellipse at 30% 50%, rgba(107,92,231,0.15), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(139,92,246,0.1), transparent 50%), hsl(var(--cb-surface))"
          }}>
          
          <div className="px-6 py-14 md:px-16 md:py-20 text-center relative z-10">
            <p className="cb-eyebrow mb-4 block text-[13px]">STOP THE BLEED</p>
            <h3 className="text-[28px] md:text-[40px] font-extrabold leading-tight text-foreground mb-3 max-w-2xl mx-auto">
              That's <span className="cb-gradient-text">${Math.round(results.totalAnnualWaste / 26).toLocaleString()}</span> per sprint —{" "}
              gone before a single feature ships.
            </h3>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              Teams using Smart Tests reclaim 40–70% of wasted CI spend in the first quarter. Book a 30-minute call and we'll build a custom ROI report for your pipeline — no strings attached.
            </p>

            <a
              href="https://www.cloudbees.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="cb-btn-primary text-lg !py-4 !px-10 inline-block"
            >
              Book Your ROI Deep-Dive →
            </a>

            <p className="text-xs text-muted-foreground mt-4 opacity-70">
              30 min · Zero commitment · Walk away with a personalized cost breakdown.
            </p>
          </div>

          {/* Decorative accents */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(var(--cb-purple)), transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(var(--cb-violet)), transparent 70%)" }} />
        </motion.div>
      </div>
    </section>);

};

export default Results;