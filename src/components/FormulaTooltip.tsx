import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

interface FormulaTooltipProps {
  content: string;
}

const FormulaTooltip = ({ content }: FormulaTooltipProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="absolute top-3 right-3 z-50">
      <button
        type="button"
        className="w-4 h-4 flex items-center justify-center rounded-full border border-cb-border text-cb-muted hover:border-cb-purple hover:text-cb-purple transition-colors cursor-pointer"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow((s) => !s)}
        aria-label="Show formula"
      >
        <Info size={10} />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-2 bg-cb-surface-2 border border-cb-border rounded-lg px-3.5 py-2.5 max-w-[280px] z-50 pointer-events-none"
          >
            <pre className="font-mono text-[11px] text-cb-muted whitespace-pre-wrap leading-relaxed">
              {content}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormulaTooltip;
