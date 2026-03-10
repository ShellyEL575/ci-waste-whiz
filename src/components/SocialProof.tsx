import { motion } from "framer-motion";

const proofPoints = [
  {
    icon: "💳",
    badge: "B2B FINTECH",
    metric: "50% reduction in CI compute cost per test run",
    detail: "Full suite runtime: 300 min → 48 min. Zero test coverage regression.",
    quote: "The time our QA team recovered on triage went straight back into test coverage improvements.",
  },
  {
    icon: "✈️",
    badge: "GLOBAL TRAVEL TECH",
    metric: "QA sign-off time: 8 hours → 2 hours per change",
    detail: "Triage bottleneck eliminated across multi-timezone release cycles.",
    quote: "We stopped treating CI failures as background noise — Smart Tests made every alert actionable.",
  },
  {
    icon: "🗄️",
    badge: "OPEN SOURCE INFRA",
    metric: "174 raw CI failures → 37 actionable issues per sprint",
    detail: "Flaky test noise identified and eliminated at the source.",
    quote: "We went from drowning in alerts to a clear, prioritized queue every morning.",
  },
];

const SocialProof = () => {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-bold text-cb-text mb-1">Teams Like Yours — Real Results</h3>
      <p className="text-sm text-cb-muted mb-6">All archetypes drawn from production CloudBees Smart Tests deployments.</p>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{ show: { transition: { staggerChildren: 0.15 } } }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {proofPoints.map((p) => (
          <motion.div
            key={p.badge}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            className="cb-card"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{p.icon}</span>
              <span className="text-[10px] uppercase text-cb-purple tracking-wider border border-cb-purple rounded-full px-2 py-0.5">
                {p.badge}
              </span>
            </div>
            <p className="text-lg font-bold text-cb-text mb-2">{p.metric}</p>
            <p className="text-[13px] text-cb-muted mb-3">{p.detail}</p>
            <div className="border-l-2 border-cb-purple pl-3">
              <p className="text-[13px] text-cb-muted italic">"{p.quote}"</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SocialProof;
