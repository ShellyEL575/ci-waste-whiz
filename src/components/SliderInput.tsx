import { Slider } from "@/components/ui/slider";

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  helper: string;
  formatBadge: (value: number) => string;
  onChange: (value: number) => void;
}

const SliderInput = ({ label, value, min, max, step, helper, formatBadge, onChange }: SliderInputProps) => {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-cb-text">{label}</label>
        <span className="text-sm font-semibold text-cb-purple bg-cb-surface-2 px-2 py-0.5 rounded">
          {formatBadge(value)}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
        className="w-full"
      />
      <p className="text-xs text-cb-muted mt-1.5">{helper}</p>
    </div>
  );
};

export default SliderInput;
