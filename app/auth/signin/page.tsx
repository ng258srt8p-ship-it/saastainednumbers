import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSignInForm } from "@/components/AdminSignInForm";

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-heading text-3xl font-bold text-gray-900">Sign In to Saasifactory</h1>
      <p className="mt-2 text-gray-600">Save your calculations and unlock Pro features.</p>
      <div className="mt-8 space-y-4">
        {process.env.AUTH_GOOGLE_ID && (
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Continue with Google
            </button>
          </form>
        )}

        {process.env.AUTH_RESEND_KEY && (
          <form
            action={async (formData: FormData) => {
              "use server";
              const email = formData.get("email") as string;
              await signIn("resend", { email, redirectTo: "/" });
            }}
          >
            <div className="flex gap-2">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <button
                type="submit"
                className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                Send Magic Link
              </button>
            </div>
          </form>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-400">Dev Access</span>
          </div>
        </div>

        <AdminSignInForm />
      </div>
    </div>
  );
}
