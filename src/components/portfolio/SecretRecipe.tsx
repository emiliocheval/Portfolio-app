import type { CSSProperties } from "react";
import { secretRecipeTools } from "@/lib/tech-icons";
import { SectionHeading } from "./SectionHeading";

export function SecretRecipe() {
  return (
    <section className="border-t border-zinc-800/60 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="skills"
          title="Technical skills"
          subtitle="Tools and technologies I use day to day."
        />
        <ul className="skill-card-grid grid grid-cols-2 gap-x-2.5 gap-y-3 py-1 sm:grid-cols-3 sm:gap-x-3 sm:gap-y-3.5 md:grid-cols-4 lg:grid-cols-5">
          {secretRecipeTools.map((tech) => (
            <li key={tech.name} className="flex justify-center overflow-visible">
              <div
                className="skill-card group relative mx-auto w-full max-w-[13.5rem] cursor-default"
                style={
                  {
                    ["--tech" as string]: tech.color,
                  } as CSSProperties
                }
              >
                {/* Behind the face: larger soft blob — only edges read past the card (opacity hover = cheap) */}
                <div
                  aria-hidden
                  className="skill-card-halo pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: "min(124%, calc(100% + 2.75rem))",
                    height: "min(130%, calc(100% + 2.25rem))",
                    background: `radial-gradient(ellipse 58% 62% at 50% 50%, ${tech.color}55 0%, ${tech.color}20 38%, transparent 68%)`,
                  }}
                />
                <div className="skill-card-face relative z-10 flex flex-col items-center gap-3.5 rounded-xl bg-zinc-950/92 px-4 py-6 text-center backdrop-blur-sm">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-xl opacity-[0.42] transition-opacity duration-300 group-hover:opacity-[0.58]"
                    style={{
                      background: `radial-gradient(100% 90% at 50% 0%, ${tech.color}35 0%, transparent 62%)`,
                    }}
                  />
                  <tech.Icon
                    className="relative z-10 h-10 w-10 shrink-0 transition-transform duration-300 ease-out group-hover:scale-[1.06] sm:h-11 sm:w-11"
                    style={{ color: tech.color }}
                    aria-hidden
                  />
                  <span className="relative z-10 max-w-[12rem] text-sm font-medium leading-snug text-zinc-100 transition-colors duration-300 group-hover:text-zinc-50">
                    {tech.name}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
