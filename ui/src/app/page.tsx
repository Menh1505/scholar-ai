import { Hero, ProblemsSection, SolutionSection, HowItWorksSection, ComparisonSection, CTASection } from "@/components/landing";
import { Navbar } from "@/components/landing/Navbar";

export default function HomePage() {
  return (
    <main className="flex flex-col w-full overflow-x-hidden">
      <Navbar />
      <Hero />
      <ProblemsSection />
      <SolutionSection />
      <HowItWorksSection />
      <ComparisonSection />
      <CTASection />
    </main>
  );
}
