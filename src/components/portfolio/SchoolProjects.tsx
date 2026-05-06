import { education } from "@/lib/portfolio-data";
import { SectionHeading } from "./SectionHeading";
import { TagPill } from "./TagPill";

export function SchoolProjects() {
  return (
    <section className="border-t border-zinc-800/60 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="education"
          title="Education"
          subtitle="Vocational training and upper secondary school."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {education.map((e) => (
            <article
              key={`${e.degree}-${e.institution}`}
              className="flex flex-col rounded-2xl border border-zinc-800/80 bg-zinc-900/35 p-6 transition hover:border-zinc-700"
            >
              <h3 className="text-xl font-bold text-white">
                {e.href ? (
                  <a
                    href={e.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-300"
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
