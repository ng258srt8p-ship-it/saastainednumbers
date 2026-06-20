"use client";

import { useState, type FormEvent } from "react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjkyperz"; // SaaStainedNumbers contact form

interface ContactFormStrings {
  formTitle: string;
  formName: string;
  formEmail: string;
  formSubject: string;
  formMessage: string;
  formSend: string;
  formSending: string;
  formSuccess: string;
  formError: string;
  formSubjectGeneral: string;
  formSubjectBug: string;
  formSubjectSuggestion: string;
  formSubjectLegal: string;
}

interface ContactFormProps {
  strings: ContactFormStrings;
}

export function ContactForm({ strings }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");

  const subjectOptions = [
    { value: "general", label: strings.formSubjectGeneral },
    { value: "bug", label: strings.formSubjectBug },
    { value: "suggestion", label: strings.formSubjectSuggestion },
    { value: "legal", label: strings.formSubjectLegal },
  ];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setSubject("general");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mobbin-card text-center py-10">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <svg className="h-7 w-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{strings.formSuccess}</p>
      </div>
    );
  }

  return (
    <div className="mobbin-card">
      <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-gray-100 mb-5">
        {strings.formTitle}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {strings.formName} <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {strings.formEmail} <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {strings.formSubject}
          </label>
          <select
            id="contact-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
          >
            {subjectOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {strings.formMessage} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors resize-y"
            placeholder="Tell us what's on your mind..."
          />
        </div>

        {status === "error" && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {strings.formError}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          {status === "sending" ? strings.formSending : strings.formSend}
        </button>
      </form>
    </div>
  );
}
