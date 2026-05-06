"use client";

import { motion } from "framer-motion";
import { experience } from "@/lib/portfolio-data";
import { SectionHeading } from "./SectionHeading";
import { TagPill } from "./TagPill";

export function ExperienceSection() {
  return (
    <section className="border-t border-zinc-800/60 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="experience"
          title="Experience"
          subtitle="Freelance and consulting work."
        />
        <div className="relative">
          <div
            className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500/50 via-violet-500/40 to-transparent sm:left-3"
            aria-hidden
          />
          <ol className="flex flex-col gap-14">
            {experience.map((job, i) => (
              <motion.li
                key={`${job.company}-${job.period}`}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.05 }}
                className="relative pl-10 sm:pl-14"
              >
                <span
                  className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-cyan-400/80 bg-zinc-950 sm:left-1"
                  aria-hidden
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                </span>
                <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-white sm:text-2xl">
                    {job.role}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-zinc-400">
                    {job.href ? (
                      <a
                        href={job.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-zinc-300 hover:text-cyan-300"
                      >
                        {job.company}
                      </a>
                    ) : (
                      <span className="font-medium text-zinc-300">
                        {job.company}
                      </span>
                    )}
                    <span className="text-sm text-zinc-500">{job.period}</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-zinc-400">
                    {job.bullets.map((b) => (
                      <li key={b} className="flex gap-2 text-sm leading-relaxed">
                        <span className="shrink-0 text-cyan-500/90" aria-hidden>
                          ▹
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex max-h-36 min-w-0 flex-wrap gap-2 overflow-y-auto overscroll-y-contain pr-0.5 [scrollbar-gutter:stable]">
                    {job.tags.map((t) => (
                      <TagPill key={t} name={t} />
                    ))}
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
