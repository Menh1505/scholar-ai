import { Hero, ProblemsSimple, SolutionsSimple, FeaturesSimple, TargetAudience, FinalCTA } from "@/components/landing";
import { Navbar } from "@/components/landing/Navbar";

export default function HomePage() {
  return (
    <main className="flex flex-col w-full overflow-x-hidden">
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
