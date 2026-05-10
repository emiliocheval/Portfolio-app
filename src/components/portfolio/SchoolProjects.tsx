"use client";

import { motion } from "framer-motion";
import { education, schoolProjects } from "@/lib/portfolio-data";
import { SectionHeading } from "./SectionHeading";
import { TagPill } from "./TagPill";
import { FiCalendar, FiShoppingBag } from "react-icons/fi";
import type { SchoolProject } from "@/lib/portfolio-data";

const iconMap: Record<string, React.ReactNode> = {
  "Event app": <FiCalendar size={28} />,
  "Headless e-commerce platform": <FiShoppingBag size={28} />,
};

function SchoolProjectCard({ project, index }: { project: SchoolProject; index: number }) {
  const icon = iconMap[project.title] ?? <FiShoppingBag size={28} />;

  const inner = (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: "easeOut" }}
      className="group flex h-full flex-col rounded-2xl border border-zinc-800/80 bg-zinc-900/35 p-6 transition hover:border-zinc-700"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition group-hover:border-zinc-700 group-hover:text-white">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white transition group-hover:text-sky-300">
        {project.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">
        {project.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <TagPill key={t} name={t} />
        ))}
      </div>
    </motion.article>
  );

  if (project.href) {
    return (
      <a href={project.href} target="_blank" rel="noopener noreferrer" className="flex">
        {inner}
      </a>
    );
  }

  return inner;
}

export function SchoolProjects() {
  return (
    <section className="border-t border-zinc-800/60 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-16">

        <div>
          <SectionHeading
            id="education"
            title="Education"
            subtitle="Vocational training and upper secondary school."
          />
          <div className="grid auto-rows-fr gap-6 md:grid-cols-2">
            {education.map((e, i) => (
              <motion.article
                key={`${e.degree}-${e.institution}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
                className="flex flex-col rounded-2xl border border-zinc-800/80 bg-zinc-900/35 p-6 transition hover:border-zinc-700"
              >
                <h3 className="text-xl font-bold text-white">
                  {e.href ? (
                    <a
                      href={e.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-sky-300"
                    >
                      {e.degree}
                    </a>
                  ) : (
                    e.degree
                  )}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  {e.institution} · {e.period}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">
                  {e.description}
                </p>
                {e.tags.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {e.tags.map((t) => (
                      <TagPill key={t} name={t} />
                    ))}
                  </div>
                ) : null}
              </motion.article>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading
            id="school-projects"
            title="School projects"
            subtitle="Projects built during my studies."
          />
          <div className="grid auto-rows-fr gap-6 md:grid-cols-2">
            {schoolProjects.map((p, i) => (
              <SchoolProjectCard key={p.title} project={p} index={i} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
