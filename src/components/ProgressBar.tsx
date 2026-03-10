interface ProgressBarProps {
  progress: number;
  visible: boolean;
}

const ProgressBar = ({ progress, visible }: ProgressBarProps) => {
  if (!visible) return null;

  return (
    <div className="fixed top-[60px] left-0 right-0 z-40 h-1 bg-cb-surface-2">
      <div
        className="h-full cb-gradient-bg transition-all duration-[400ms] ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
