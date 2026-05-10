"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiGithub, FiFileText } from "react-icons/fi";

const spring = { type: "spring" as const, stiffness: 120, damping: 18 };

const WORDS = ["Problem solver", "Web developer", "Curious learner"] as const;

const blobValues = [
  "60% 40% 55% 45% / 55% 45% 55% 45%",
  "40% 60% 45% 55% / 48% 52% 42% 58%",
  "55% 45% 40% 60% / 60% 40% 55% 45%",
  "45% 55% 60% 40% / 45% 55% 48% 52%",
  "60% 40% 55% 45% / 55% 45% 55% 45%",
];

const blobTransition = {
  duration: 9,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

const GLASS =
  "inline-flex items-center justify-center gap-2 border border-white/10 bg-white/5 backdrop-blur-md transition hover:border-white/20 hover:bg-white/10";

function TypingWord() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    const word = WORDS[index];
    if (!erasing) {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setErasing(true), 1800);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
        return () => clearTimeout(t);
      } else {
        setErasing(false);
        setIndex((i) => (i + 1) % WORDS.length);
      }
    }
  }, [displayed, erasing, index]);

  return (
    <span className="text-sky-400">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col justify-center px-4 pb-24 pt-28 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-12 lg:flex-row lg:items-center lg:justify-center lg:gap-24">
        <div className="flex max-w-2xl flex-col items-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              HI
            </h1>
            <h2 className="mt-1 bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
              I&apos;M EMIL CONRADSSON
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.22 }}
            className="mt-3 h-10 text-3xl font-bold tracking-tight text-zinc-300 sm:text-4xl"
          >
            <TypingWord />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.32 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#projects"
              className={`${GLASS} h-12 rounded-xl px-8 text-base font-semibold text-white`}
            >
              View projects
            </a>
            <a
              href="#contact"
              className={`${GLASS} h-12 rounded-xl px-8 text-base font-semibold text-zinc-200`}
            >
              Get in touch
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.4 }}
            className="mt-3 flex items-center justify-center gap-3"
          >
            <a
              href="https://github.com/emiliocheval"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={`${GLASS} h-10 w-10 rounded-xl text-zinc-300`}
            >
              <FiGithub size={18} />
            </a>
            <a
              href="/Emil_Conradsson_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Resume"
              className={`${GLASS} h-10 w-10 rounded-xl text-zinc-300`}
            >
              <FiFileText size={18} />
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
              borderRadius: blobValues,
              boxShadow: [
                "0 0 0 0px rgba(56, 189, 248, 0.3)",
                "0 0 0 16px rgba(56, 189, 248, 0)",
              ],
            }}
            transition={{
              borderRadius: blobTransition,
              boxShadow: { duration: 2.4, repeat: Infinity, ease: "easeOut" },
            }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "conic-gradient(from 0deg, #38bdf8, #7dd3fc, #bae6fd, #38bdf8, #0ea5e9, #7dd3fc)",
              }}
              animate={{
                rotate: 360,
                borderRadius: blobValues,
              }}
              transition={{
                rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                borderRadius: blobTransition,
              }}
            />
            <motion.div
              className="absolute inset-1 z-10 overflow-hidden border border-zinc-800/90 bg-zinc-950"
              animate={{ borderRadius: blobValues }}
              transition={blobTransition}
            >
              <Image
                src="/Profilepic.png"
                alt="Emil Conradsson"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 16rem, 18rem"
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
