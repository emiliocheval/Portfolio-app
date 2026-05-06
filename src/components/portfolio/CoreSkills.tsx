"use client";

import { motion } from "framer-motion";
import { coreSkills } from "@/lib/portfolio-data";
import { getTagPillProps } from "@/lib/tech-icons";
import { SectionHeading } from "./SectionHeading";

export function CoreSkills() {
  return (
    <section className="border-t border-zinc-800/60 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Focus areas"
          subtitle="What I work with the most."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coreSkills.map((name, i) => {
            const { color, Icon } = getTagPillProps(name);
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-5 rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 p-5"
                style={{
                  boxShadow: `0 0 40px -18px ${color}55`,
                }}
              >
                <Icon
                  className="h-11 w-11 shrink-0 sm:h-14 sm:w-14"
                  style={{ color }}
                  aria-hidden
                />
                <span className="text-lg font-semibold text-white">{name}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
