"use client";

import type { ReactNode } from "react";
import { PrivacyNotice } from "./PrivacyNotice";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface CalculatorShellProps {
  title: string;
  description: string;
  children: ReactNode;
  breadcrumbs?: Breadcrumb[];
  contentSection?: ReactNode;
  faqSection?: ReactNode;
  relatedCalculators?: ReactNode;
  verifiedBadge?: ReactNode;
  feedbackWidget?: ReactNode;
  embedButton?: ReactNode;
  stageSelector?: ReactNode;
}

export function CalculatorShell({
  title,
  description,
  children,
  contentSection,
  faqSection,
  relatedCalculators,
  verifiedBadge,
  feedbackWidget,
  embedButton,
  breadcrumbs,
  stageSelector,
}: CalculatorShellProps) {
  return (
    <div className="bg-page-bg">
      <article className="mx-auto max-w-4xl px-4 py-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-2 text-xs text-gray-400">
            {breadcrumbs.map((crumb, i) => (
              <li key={crumb.label} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-brand-400 transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-gray-300 font-medium">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 text-lg text-gray-400">{description}</p>
          </div>
          {stageSelector && <div className="shrink-0">{stageSelector}</div>}
        </div>
        {verifiedBadge}
      </header>

      <div className="rounded-2xl border border-gray-800 bg-card-bg p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">{children}</div>
          {embedButton && <div className="shrink-0">{embedButton}</div>}
        </div>
        <PrivacyNotice />
      </div>

      {feedbackWidget && <div className="mt-4">{feedbackWidget}</div>}

      {contentSection && (
        <section className="mt-12">
          <div className="prose prose-invert max-w-none">{contentSection}</div>
        </section>
      )}

      {faqSection && (
        <section className="mt-12">
          <h2 className="font-heading text-2xl font-bold text-gray-100">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 space-y-3">{faqSection}</div>
        </section>
      )}

      {relatedCalculators && (
        <section className="mt-12 border-t border-gray-800 pt-8">
          <h2 className="font-heading text-xl font-bold text-gray-100">
            Related Calculators
          </h2>
          <div className="mt-4">{relatedCalculators}</div>
        </section>
      )}
    </article>
    </div>
  );
}
