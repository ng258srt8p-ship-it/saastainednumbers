"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
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
  afterContentAd?: ReactNode;
  faqSection?: ReactNode;
  relatedCalculators?: ReactNode;
  feedbackWidget?: ReactNode;
  embedButton?: ReactNode;
  stageSelector?: ReactNode;
  sidebarAd?: ReactNode;
  showAffiliateDisclosure?: boolean;
  strings?: {
    faqTitle: string;
    relatedCalculatorsTitle: string;
   };
}

export function CalculatorShell({
  title,
  description,
  children,
  contentSection,
  afterContentAd,
  faqSection,
  relatedCalculators,
  feedbackWidget,
  embedButton,
   breadcrumbs,
  stageSelector,
  sidebarAd,
  showAffiliateDisclosure,
   strings,
}: CalculatorShellProps) {
  return (
    <div className="bg-page-bg">
      <article className="mx-auto max-w-4xl px-4 py-4 sm:py-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            {breadcrumbs.map((crumb, i) => (
              <li key={crumb.label} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-brand-400 transition-colors">
                      {crumb.label}
                    </Link>

                ) : (
                  <span className="text-gray-600 dark:text-gray-300 font-medium">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              {title}
            </h1>
            <p className="mt-1 sm:mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-400">{description}</p>
          </div>
          {stageSelector && <div className="shrink-0 self-start">{stageSelector}</div>}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-card-bg p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0 w-full sm:w-auto">{children}</div>
              {embedButton && <div className="shrink-0 w-full sm:w-auto">{embedButton}</div>}
            </div>
            <PrivacyNotice />
          </div>

          {feedbackWidget && <div className="mt-4">{feedbackWidget}</div>}

          {contentSection && (
            <section className="mt-12">
              <div className="prose prose-invert max-w-none">{contentSection}</div>
            </section>
          )}

          {afterContentAd && <div className="mt-8">{afterContentAd}</div>}
        </div>

        {sidebarAd && <div className="w-full lg:w-72 shrink-0">{sidebarAd}</div>}
      </div>

        {showAffiliateDisclosure && (
          <div className="mt-10">
            <AffiliateDisclosure />
          </div>
        )}

        {faqSection && (
          <section className="mt-12">
            <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-gray-100">
             {strings?.faqTitle ?? "Frequently Asked Questions"}
            </h2>
            <div className="mt-6 space-y-3">{faqSection}</div>
          </section>
        )}

        {relatedCalculators && (
          <section className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-8">
            <h2 className="font-heading text-xl font-bold text-gray-900 dark:text-gray-100">
             {strings?.relatedCalculatorsTitle ?? "Related Calculators"}
            </h2>
          <div className="mt-4">{relatedCalculators}</div>
        </section>
      )}
    </article>
    </div>
  );
}
