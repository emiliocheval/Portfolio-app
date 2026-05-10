import Image from "next/image";
import type { Project } from "@/lib/portfolio-data";
import { featuredProjects } from "@/lib/portfolio-data";
import { SectionHeading } from "./SectionHeading";
import { TagPill } from "./TagPill";

function isExternalHref(href: string) {
  return href.startsWith("http");
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reverse = index % 2 === 1;
  const src = project.image ?? `https://picsum.photos/seed/${project.imageSeed}/960/600`;
  const external = isExternalHref(project.href);

  const mediaClassName =
    "relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl border border-zinc-800/80 lg:max-w-md";

  const mediaInner = (
    <>
      <Image
        src={src}
        alt={`${project.title} — preview`}
        fill
        className="object-cover transition duration-500 group-hover:scale-[1.02]"
        sizes="(max-width: 1024px) 100vw, 28rem"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent opacity-0 transition group-hover:opacity-100" />
    </>
  );

  return (
    <article
      className={`group flex flex-col gap-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-sm transition hover:border-zinc-700/90 lg:flex-row lg:items-start lg:gap-10 lg:p-8 ${
        reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      {external ? (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className={mediaClassName}
        >
          {mediaInner}
        </a>
      ) : (
        <div className={mediaClassName}>{mediaInner}</div>
      )}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {project.badge ? (
            <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium tracking-wide text-amber-200/90">
              {project.badge}
            </span>
          ) : null}
        </div>
        <h3 className="text-2xl font-bold text-white">
          {external ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-cyan-300"
            >
              {project.title}
            </a>
          ) : (
            <span>{project.title}</span>
          )}
        </h3>
        <p className="mt-3 flex-1 text-zinc-400">{project.description}</p>
        <div className="mt-5 flex max-h-36 min-w-0 flex-wrap gap-2 overflow-y-auto overscroll-y-contain pr-0.5 [-ms-overflow-style:auto] [scrollbar-gutter:stable]">
          {project.tags.map((t) => (
            <TagPill key={t} name={t} />
          ))}
        </div>
      </div>
    </article>
  );
}

export function FeaturedProjects() {
  return (
    <section className="border-t border-zinc-800/60 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="projects"
          title="Featured projects"
          subtitle="Products and platforms I have built and shipped."
        />
        <div className="flex flex-col gap-16">
          {featuredProjects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
