import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { AnalyticsClient } from "@/components/AnalyticsClient";
import { AuthProvider } from "@/components/AuthProvider";
import { Nav } from "@/components/Nav";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Saasifactory",
    default: "Saasifactory — SaaS & Business Operations Calculator Suite",
  },
  description:
    "Free, instant SaaS calculators for MRR, CAC, LTV, churn, and more. No account required.",
  metadataBase: new URL("https://saasifactory.io"),
  icons: {
    icon: "/favicon.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    siteName: "Saasifactory",
    images: ["/api/og?title=Saasifactory"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans">
        <AnalyticsClient />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
        >
          Skip to content
        </a>
        <AuthProvider>
          <Nav />
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </AuthProvider>
        <footer className="border-t border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Product</h3>
                <ul className="mt-3 space-y-2">
                  <li><Link href="/" className="text-sm text-gray-700 hover:text-brand-600 transition-colors">Home</Link></li>
                  <li><Link href="/calculators" className="text-sm text-gray-700 hover:text-brand-600 transition-colors">All Calculators</Link></li>
                  <li><Link href="/pricing" className="text-sm text-gray-700 hover:text-brand-600 transition-colors">Pricing</Link></li>
                  <li><Link href="/dashboard" className="text-sm text-gray-700 hover:text-brand-600 transition-colors">Dashboard</Link></li>
                  <li><Link href="/request-calculator" className="text-sm text-gray-700 hover:text-brand-600 transition-colors">Request a Calculator</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Categories</h3>
                <ul className="mt-3 space-y-2">
                  <li><Link href="/revenue" className="text-sm text-gray-700 hover:text-brand-600 transition-colors">Revenue</Link></li>
                  <li><Link href="/unit-economics" className="text-sm text-gray-700 hover:text-brand-600 transition-colors">Unit Economics</Link></li>
                  <li><Link href="/growth-efficiency" className="text-sm text-gray-700 hover:text-brand-600 transition-colors">Growth Efficiency</Link></li>
                  <li><Link href="/churn-retention" className="text-sm text-gray-700 hover:text-brand-600 transition-colors">Churn & Retention</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Resources</h3>
                <ul className="mt-3 space-y-2">
                  <li><Link href="/blog" className="text-sm text-gray-700 hover:text-brand-600 transition-colors">Blog</Link></li>
                  <li><Link href="/request-calculator" className="text-sm text-gray-700 hover:text-brand-600 transition-colors">Suggest a Feature</Link></li>
                  <li><Link href={`mailto:hello@saasifactory.io`} className="text-sm text-gray-700 hover:text-brand-600 transition-colors">Contact</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row">
              <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Saasifactory. All rights reserved.</p>
              <div className="flex gap-4">
                <Link href="/blog" className="text-xs text-gray-500 hover:text-brand-600 transition-colors">Blog</Link>
                <Link href="/request-calculator" className="text-xs text-gray-500 hover:text-brand-600 transition-colors">Request</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
