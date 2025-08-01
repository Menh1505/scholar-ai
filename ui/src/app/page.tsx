import { Hero, ProblemsSection, SolutionSection, HowItWorksSection, ComparisonSection, CTASection } from "@/components/landing";

export default function HomePage() {
  return (
    <main className="flex flex-col w-full overflow-x-hidden">
      <Hero />
      <ProblemsSection />
      <SolutionSection />
      <HowItWorksSection />
      <ComparisonSection />
      <CTASection />
    </main>
  );
}
