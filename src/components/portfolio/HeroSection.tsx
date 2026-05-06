"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const spring = { type: "spring" as const, stiffness: 120, damping: 18 };

const TAGLINE_PARTS = [
  "Front-end developer",
  "TypeScript",
  "React",
  "Design systems",
  "Figma",
  "Eye for detail",
] as const;

const PROFILE =
  "Front-end developer with a strong eye for detail, user experience, and design quality. I have built and shipped my own design system from the ground up, worked closely with UI/UX on freelance projects, and I am used to owning the full journey from idea to delivery. I am structured, low-ego, and I thrive when collaborating closely with designers and back-end developers. I pick up new technologies quickly and am comfortable delivering under my own ownership.";

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col justify-center px-4 pb-24 pt-28 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="max-w-2xl text-center lg:text-left">
          <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 lg:justify-start">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.12 }}
              className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              HI
            </motion.h1>
            <motion.span
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: 0.2 }}
              className="text-5xl font-light text-zinc-500 sm:text-6xl lg:text-7xl"
            >
              I&apos;M
            </motion.span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.22 }}
            className="mt-1 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl"
          >
            EMIL CONRADSSON
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.26 }}
            className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-zinc-400 sm:text-base lg:justify-start"
          >
            {TAGLINE_PARTS.map((part, i) => (
              <span key={part} className="inline-flex items-center gap-x-2">
                {i > 0 ? (
                  <span className="text-zinc-600" aria-hidden>
                    |
                  </span>
                ) : null}
                <span>{part}</span>
              </span>
            ))}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.3 }}
            className="mt-3 flex flex-col gap-1 text-sm text-zinc-500 sm:flex-row sm:flex-wrap sm:gap-x-4"
          >
            <a href="tel:+46765541507" className="hover:text-zinc-300">
              +46 765 541 507
            </a>
            <a
              href="mailto:Emil.conradsson1@gmail.com"
              className="hover:text-zinc-300"
            >
              Emil.conradsson1@gmail.com
            </a>
            <span>Stockholm, Sweden</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.34 }}
            className="mt-6 max-w-xl text-left text-sm leading-relaxed text-zinc-400 sm:text-base"
          >
            {PROFILE}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.38 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <a
              href="#projects"
              className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-8 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:brightness-110"
            >
              View projects
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-600 bg-zinc-900/50 px-8 text-sm font-semibold text-zinc-100 backdrop-blur transition hover:border-zinc-500 hover:bg-zinc-800/80"
            >
              Get in touch
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.18 }}
          className="relative shrink-0"
        >
          <motion.div
            className="relative h-64 w-64 sm:h-72 sm:w-72"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(34, 211, 238, 0.28)",
                "0 0 0 14px rgba(34, 211, 238, 0)",
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            style={{ borderRadius: "9999px" }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, #22d3ee, #818cf8, #e879f9, #22d3ee, #38bdf8, #a78bfa)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-[4px] z-10 overflow-hidden rounded-full border border-zinc-800/90 bg-zinc-950">
              <Image
                src="https://ui-avatars.com/api/?name=Emil+Conradsson&size=512&background=18181b&color=f4f4f5&bold=true&font-size=0.28"
                alt="Emil Conradsson"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 16rem, 18rem"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
