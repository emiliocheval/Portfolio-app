"use client";

import { useState, useTransition } from "react";
import { SectionHeading } from "./SectionHeading";
import { sendContactEmail } from "@/app/actions/contact";
import { FiSend } from "react-icons/fi";

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await sendContactEmail(formData);
      if (result.ok) {
        setStatus("success");
      } else {
        setErrorMsg(result.error ?? "Something went wrong.");
        setStatus("error");
      }
    });
  }

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

        {status === "success" ? (
          <div className="mt-8 rounded-xl border border-sky-500/30 bg-sky-500/10 px-6 py-5 text-sm text-sky-300">
            Thanks — your message has been sent. I&apos;ll get back to you soon.
          </div>
        ) : (
          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
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

            {status === "error" && (
              <p className="text-sm text-red-400">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-sky-400 to-sky-600 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Sending…
                </>
              ) : (
                <>
                  <FiSend size={15} />
                  Send message
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
