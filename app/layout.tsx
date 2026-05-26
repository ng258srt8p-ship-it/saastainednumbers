import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Permanent_Marker } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { Nav } from "@/components/Nav";
import { PostHogProvider } from "@/components/PostHogProvider";
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

const permanentMarker = Permanent_Marker({
  variable: "--font-numbers",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | SaaStainedNumbers",
    default: "SaaStainedNumbers  -  Free Calculators for Builders & Creators",
  },
  description:
    "Free, instant SaaS calculators for MRR, CAC, LTV, churn, and more. Available in 6 languages. No account or sign-up required.",
  metadataBase: new URL("https://saastainednumbers.com"),
  icons: {
    icon: "/favicon.png",
    apple: "/logo.svg",
  },
  openGraph: {
    type: "website",
    siteName: "SaaStainedNumbers",
    images: ["/api/og?title=SaaStainedNumbers"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} ${permanentMarker.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
        <PostHogProvider>
        <script dangerouslySetInnerHTML={{ __html: "document.cookie='locale=;path=/;max-age=0'" }} />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" as="style" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" crossOrigin="anonymous" media="all" />
        {/* @ts-expect-error Shopify uses `value` instead of `content` for its meta verification tag */}
        <meta name="impact-site-verification" value="3bf25d0f-602c-486a-82a3-9453b6b12c4c" />
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.NEXT_PUBLIC_ADSENSE_ID ?? "0000000000000000"}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script id="impact-tracking" strategy="afterInteractive">
          {`(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A7346865-68e6-4c72-b468-1f8baef5f5681.js','script','impactStat',document,window);impactStat('trackImpression');`}
        </Script>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
        >
          Skip to content
        </a>
          <Nav />
          <main id="main-content" className="flex-1">
            {children}
          </main>
        <footer className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-6 sm:gap-8 lg:gap-12">
              <div className="w-full sm:w-auto">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Product</h3>
                <ul className="mt-3 space-y-2">
                  <li><Link href="/" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">Home</Link></li>
                  <li><Link href="/calculators" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">All Calculators</Link></li>
                  <li><Link href="/pricing" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">Pricing</Link></li>
                  <li><Link href="/dashboard" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">Dashboard</Link></li>
                </ul>
              </div>
              <div className="w-full sm:w-auto">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Categories</h3>
                <ul className="mt-3 space-y-2">
                  <li><Link href="/revenue" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">Revenue</Link></li>
                  <li><Link href="/unit-economics" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">Unit Economics</Link></li>
                  <li><Link href="/growth-efficiency" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">Growth & Efficiency</Link></li>
                  <li><Link href="/churn-retention" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">Churn & Retention</Link></li>
                  <li><Link href="/ai-cost" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">AI Cost</Link></li>
                  <li><Link href="/side-hustle" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">Side Hustle</Link></li>
                  <li><Link href="/personal-finance" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">Personal Finance</Link></li>
                  <li><Link href="/general-business" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">General Business</Link></li>
                  <li><Link href="/saas-deepen" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">SaaS Deepen</Link></li>
                </ul>
              </div>
              <div className="w-full sm:w-auto">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Resources</h3>
                <ul className="mt-3 space-y-2">
                  <li><Link href="/blog" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">Blog</Link></li>
                </ul>
              </div>
              <div className="w-full sm:w-auto">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Legal</h3>
                <ul className="mt-3 space-y-2">
                  <li><Link href="/legal#disclaimer" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">Disclaimer</Link></li>
                  <li><Link href="/legal#privacy" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/legal#terms" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">Terms of Service</Link></li>
                  <li><Link href="/legal#cookies" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">Cookie Policy</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 dark:border-gray-700 pt-6 sm:flex-row">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" className="w-8 h-8 shrink-0" aria-hidden>
                  <polygon points="20,70 60,70 40,40" fill="#008387" stroke="#008387" strokeWidth="5" strokeLinejoin="round"/>
                  <polygon points="26,32 54,32 40,10" fill="#143562" stroke="#143562" strokeWidth="5" strokeLinejoin="round"/>
                </svg>
                <p className="text-xs text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} SaaStainedNumbers. All rights reserved.</p>
              </div>
              <div className="flex gap-4">
                <Link href="/blog" className="text-xs text-gray-500 dark:text-gray-400 hover:text-brand-600 transition-colors">Blog</Link>

              </div>
            </div>
          </div>
        </footer>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "SaaStainedNumbers",
                  url: "https://saastainednumbers.com",
                  logo: "https://saastainednumbers.com/logo.svg",
                  description:
                    "Free, instant SaaS calculators for MRR, CAC, LTV, churn, and more. No account required.",
                },
                {
                  "@type": "WebSite",
                  name: "SaaStainedNumbers",
                  url: "https://saastainednumbers.com",
                  description:
                    "Free, instant SaaS calculators for MRR, CAC, LTV, churn, and more. No account required.",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: "https://saastainednumbers.com/calculators?q={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
        </PostHogProvider>
      </body>
    </html>
  );
}
