import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  format?: (n: number) => string;
  className?: string;
  duration?: number;
  triggerOnView?: boolean;
}

const formatCurrency = (n: number) =>
  "$" + Math.round(n).toLocaleString("en-US");

const AnimatedNumber = ({
  value,
  format = formatCurrency,
  className = "",
  duration = 400,
  triggerOnView = false,
}: AnimatedNumberProps) => {
  const [display, setDisplay] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(!triggerOnView);
  const ref = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(0);

  useEffect(() => {
    if (!triggerOnView) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasTriggered(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [triggerOnView]);

  useEffect(() => {
    if (!hasTriggered) return;
    const from = prevValue.current;
    const to = value;
    prevValue.current = value;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(from + (to - from) * progress);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, hasTriggered, duration]);

  return (
    <span ref={ref} className={className}>
      {hasTriggered ? format(display) : format(0)}
    </span>
  );
};

export { AnimatedNumber, formatCurrency };
