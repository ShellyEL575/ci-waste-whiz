import { COPY } from "@/config/defaults";



const Hero = () => {
  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="min-h-[440px] md:min-h-[560px] flex flex-col items-center justify-center text-center px-4 pt-[60px]"
      style={{
        background: "radial-gradient(ellipse at center, #1A1030 0%, hsl(240,10%,5%) 70%)"
      }}>
      
      <span className="cb-eyebrow border border-cb-purple px-3 py-1 rounded-full mb-6 inline-block">
        CI WASTE CALCULATOR
      </span>

      <h1 className="text-[40px] md:text-[64px] font-extrabold text-cb-text leading-tight mb-6 max-w-4xl">
        How Much do Flaky Tests and "Rerun Everything" is
        {" "}
        <span className="relative">
          <span className="cb-gradient-text">Costing You?</span>
          <span
            className="absolute bottom-0 left-0 right-0 h-1 rounded-full cb-gradient-bg" />
          
        </span>
      </h1>

      <p className="text-base md:text-xl text-cb-muted max-w-[560px] mb-8 leading-relaxed">Get a personalized breakdown of your annual CI waste. Takes Under 2 minutes!


      </p>


    </section>);

};

export default Hero;