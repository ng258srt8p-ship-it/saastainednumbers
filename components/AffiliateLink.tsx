"use client";

import { affiliatePrograms } from "@/lib/affiliates";

interface AffiliateLinkProps {
  programName: string;
  category: string;
  children: React.ReactNode;
  className?: string;
}

export function AffiliateLink({ programName, category, children, className }: AffiliateLinkProps) {
  const program = affiliatePrograms.find((p) => p.name === programName);
  if (!program) return <>{children}</>;

  return (
    <a
      href={program.signupUrl || program.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={className}
      data-affiliate={programName}
      data-category={category}
    >
      {children}
    </a>
  );
}
