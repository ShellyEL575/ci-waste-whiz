import { useState, useEffect, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProgressBar from "@/components/ProgressBar";
import Calculator from "@/components/Calculator";
import Results from "@/components/Results";
import LeadModal from "@/components/LeadModal";
import type { LeadFormData } from "@/components/LeadModal";
import Footer from "@/components/Footer";
import { INPUTS } from "@/config/defaults";
import { calculateWaste } from "@/lib/calculations";
import { generatePDF } from "@/lib/generatePDF";
import { useToast } from "@/hooks/use-toast";

type InputKey = keyof typeof INPUTS;
type InputValues = Record<InputKey, number>;

const getDefaults = (): InputValues => {
  const vals = {} as InputValues;
  for (const key of Object.keys(INPUTS) as InputKey[]) {
    vals[key] = INPUTS[key].default;
  }
  return vals;
};

const Index = () => {
  const { toast } = useToast();
  const [values, setValues] = useState<InputValues>(getDefaults);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [advancedOpened, setAdvancedOpened] = useState(false);

  const results = useMemo(() => calculateWaste(values), [values]);

  const handleChange = useCallback((key: InputKey, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleLeadSubmit = (data: LeadFormData) => {
    console.log({
      ...data,
      results,
      inputs: values,
      source: "CI Waste Calculator",
    });

    setFirstName(data.firstName);
    setShowLeadModal(false);
    setDownloadComplete(true);

    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    generatePDF(
      { firstName: data.firstName, lastName: data.lastName, company: data.company, jobTitle: data.jobTitle },
      values as unknown as Record<string, number>,
      results as unknown as Record<string, number>,
      { advancedOpened }
    );

    toast({
      title: "Your report is downloading!",
      description: "Check your downloads folder.",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const progress = useMemo(() => {
    if (!scrolledPastHero) return 0;
    return 50;
  }, [scrolledPastHero]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProgressBar progress={progress} visible={scrolledPastHero} />
      <Hero />

      <Calculator
        values={values}
        onChange={handleChange}
        agenticSharePercent={results.agenticSharePercent}
        totalAnnualWaste={results.totalAnnualWaste}
        advancedOpened={advancedOpened}
        onAdvancedOpened={() => setAdvancedOpened(true)}
      />

      <Results
        results={results}
        inputs={values as unknown as Record<string, number>}
      />

      <LeadModal
        open={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        onSubmit={handleLeadSubmit}
        defaultTeamSize={values.A1}
      />

      <Footer />
    </div>
  );
};

export default Index;
