"use client";

import { useState } from "react";
import { SectionHeading } from "./SectionHeading";

export function ContactSection() {
  const [sent, setSent] = useState(false);

  return (
    <section className="border-t border-zinc-800/60 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <SectionHeading
          id="contact"
          title="Get in touch"
          subtitle="Reach out if you would like to collaborate or ask a question."
        />
        <p className="mt-4 text-sm text-zinc-400">
          <a
            href="mailto:Emil.conradsson1@gmail.com"
            className="text-sky-400/90 underline-offset-4 hover:text-sky-300 hover:underline"
          >
            Emil.conradsson1@gmail.com
          </a>
          {" · "}
          <a
            href="tel:+46765541507"
            className="text-sky-400/90 underline-offset-4 hover:text-sky-300 hover:underline"
          >
            +46 765 541 507
          </a>
          {" · "}Stockholm, Sweden
        </p>
        <form
          className="mt-8 flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-300">
            Name
            <input
              name="name"
              required
              className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-zinc-100 outline-none ring-sky-500/40 transition placeholder:text-zinc-600 focus:border-sky-500/50 focus:ring-2"
              placeholder="Your name"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-300">
            Email
            <input
              name="email"
              type="email"
              required
              className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-zinc-100 outline-none ring-sky-500/40 transition placeholder:text-zinc-600 focus:border-sky-500/50 focus:ring-2"
              placeholder="you@example.com"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-300">
            Message
            <textarea
              name="message"
              required
              rows={5}
              className="resize-y rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-zinc-100 outline-none ring-sky-500/40 transition placeholder:text-zinc-600 focus:border-sky-500/50 focus:ring-2"
              placeholder="Write your message here"
            />
          </label>
          <button
            type="submit"
            className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-sky-400 to-sky-600 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110"
          >
            {sent ? "Thanks — your message was recorded" : "Send message"}
          </button>
        </form>
      </div>
    </section>
  );
}
