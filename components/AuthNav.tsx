import { auth, signOut } from "@/lib/auth";
import Link from "next/link";

export async function AuthNav() {
  const session = await auth();

  const isPro = session?.user?.subscriptionTier === "pro";

  return (
    <div className="flex items-center gap-3 text-sm">
      {session?.user ? (
        <>
          {isPro && (
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
              Pro
            </span>
          )}
          <Link href="/account/calculations" className="text-gray-600 hover:text-gray-900">
            My Calculations
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit" className="text-gray-600 hover:text-gray-900">
              Sign Out
            </button>
          </form>
        </>
      ) : (
        <Link
          href="/auth/signin"
          className="rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Sign In
        </Link>
      )}
    </div>
  );
}
