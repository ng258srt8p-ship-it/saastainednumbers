"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

interface PremiumGateProps {
  premium: boolean;
  children: React.ReactNode;
}

export function PremiumGate({ premium, children }: PremiumGateProps) {
  const { data: session } = useSession();

  if (!premium || session?.user?.subscriptionTier === "pro") {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl">
        <div className="text-center p-8">
          <p className="text-3xl mb-2">🔒</p>
          <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">Pro Feature</h3>
          <p className="text-sm text-gray-600 mb-6 max-w-xs">
            Upgrade to Pro to unlock this calculator and all premium features.
          </p>
          <Link
            href={session ? "/pricing" : "/auth/signin"}
            className="inline-block rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            {session ? "Upgrade to Pro" : "Sign In to Upgrade"}
          </Link>
        </div>
      </div>
    </div>
  );
}
