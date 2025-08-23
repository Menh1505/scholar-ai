import { Hero, InteractiveBackground, ProblemsSimple, SolutionsSimple, FeaturesSimple, TargetAudience, FinalCTA } from "@/components/landing";
import { Navbar } from "@/components/landing/Navbar";

export default function HomePage() {
  return (
    <main className="flex flex-col w-full overflow-x-hidden relative">
      <InteractiveBackground />
      <Navbar />
      <Hero />
      <ProblemsSimple />
      <SolutionsSimple />
      <FeaturesSimple />
      <TargetAudience />
      <FinalCTA />
    </main>
  );
}
