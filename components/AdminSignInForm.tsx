"use client";

import { signIn } from "next-auth/react";

export function AdminSignInForm() {
  return (
    <button
      type="button"
      onClick={() => signIn("admin", { username: "admin@saasifactory.com", password: "admin", redirectTo: "/" })}
      className="w-full rounded-lg border-2 border-dashed border-brand-300 bg-brand-50 px-5 py-2.5 text-sm font-medium text-brand-700 hover:bg-brand-100 transition-colors"
    >
      Sign in as Admin (dev only)
    </button>
  );
}
