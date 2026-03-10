import { COPY } from "@/config/defaults";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-cb-bg border-b border-cb-border flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-cb-purple">
          <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="currentColor" opacity="0.8" />
          <path d="M12 2L3 7l9 5 9-5-9-5z" fill="currentColor" />
        </svg>
        <span className="text-cb-text font-bold text-lg">CloudBees</span>
      </div>
      <a href={COPY.demoURL} className="cb-btn-secondary text-sm !py-2 !px-4">
        Book a Demo
      </a>
    </header>
  );
};

export default Header;
