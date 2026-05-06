import { ContactSection } from "@/components/portfolio/ContactSection";
import { CoreSkills } from "@/components/portfolio/CoreSkills";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { FeaturedProjects } from "@/components/portfolio/FeaturedProjects";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { InteractiveBackground } from "@/components/portfolio/InteractiveBackground";
import { SchoolProjects } from "@/components/portfolio/SchoolProjects";
import { SecretRecipe } from "@/components/portfolio/SecretRecipe";
import { SiteFooter } from "@/components/portfolio/SiteFooter";
import { SiteHeader } from "@/components/portfolio/SiteHeader";

export default function Home() {
  return (
    <>
      <InteractiveBackground />
      <SiteHeader />
      <main id="main" className="relative flex-1">
        <HeroSection />
        <FeaturedProjects />
        <SchoolProjects />
        <SecretRecipe />
        <CoreSkills />
        <ExperienceSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
