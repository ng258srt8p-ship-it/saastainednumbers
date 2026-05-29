import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Permanent_Marker } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { AdScript } from "@/components/AdScript";
import { ShowWhenNotEmbed } from "@/components/ShowWhenNotEmbed";
import { Nav } from "@/components/Nav";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { getTranslations } from "@/lib/getTranslations";
import { alternateLanguages, localeUrl } from "@/lib/locale-url";
import { getAllKnownCategories, getCategoryTranslationKey } from "@/lib/registry";
import type { Locale } from "@/lib/useLocale";
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

export async function generateMetadata(): Promise<Metadata> {
  const title = {
    template: "%s | SaaStainedNumbers",
    default: "SaaStainedNumbers  -  Free Calculators for Builders & Creators",
  };
  const description = "Free, instant SaaS calculators for MRR, CAC, LTV, churn, and more. No account or sign-up required.";
  return {
    title,
    description,
    metadataBase: new URL("https://saastainednumbers.com"),
    icons: {
      icon: "/favicon.png",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      type: "website",
      siteName: "SaaStainedNumbers",
      images: ["/api/og?title=SaaStainedNumbers"],
    },
    twitter: {
      card: "summary_large_image",
      title: "SaaStainedNumbers",
      description,
      images: ["/api/og?title=SaaStainedNumbers"],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: localeUrl("/"),
      languages: alternateLanguages("/"),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t, locale } = await getTranslations();

  const categorySlugs = getAllKnownCategories();

  return (
    <html lang={locale} className={`${inter.variable} ${jakarta.variable} ${permanentMarker.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
        <CurrencyProvider locale={locale as Locale}>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-BHDH2PETBK" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-BHDH2PETBK');`}
        </Script>
        <AdScript />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" crossOrigin="anonymous" media="all" />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
        >
          {t("common.skipToContent")}
        </a>
          <ShowWhenNotEmbed><Nav /></ShowWhenNotEmbed>
          <main id="main-content" className="flex-1">
            {children}
          </main>
        <ShowWhenNotEmbed><footer className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-6 sm:gap-8 lg:gap-12">
              <div className="w-full sm:w-auto">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t("footer.product")}</h3>
                <ul className="mt-3 space-y-2">
                  <li><Link href="/" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">{t("common.home")}</Link></li>
                  <li><Link href="/calculators" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">{t("category.all")}</Link></li>
                  <li><Link href="/pricing" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">{t("nav.pricing")}</Link></li>
                  <li><Link href="/dashboard" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">{t("nav.dashboard")}</Link></li>
                </ul>
              </div>
              <div className="w-full sm:w-auto">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">{t("footer.categories")}</h3>
                <ul className="mt-3 space-y-2">
                  {categorySlugs.map((slug) => (
                    <li key={slug}>
                      <Link href={`/${slug}`} className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">
                        {t(`category.${getCategoryTranslationKey(slug)}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full sm:w-auto">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">{t("footer.resources")}</h3>
                <ul className="mt-3 space-y-2">
                  <li><Link href="/blog" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">{t("nav.blog")}</Link></li>
                </ul>
              </div>
              <div className="w-full sm:w-auto">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">{t("footer.legal")}</h3>
                <ul className="mt-3 space-y-2">
                  <li><Link href="/legal#disclaimer" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">{t("footer.disclaimer")}</Link></li>
                  <li><Link href="/legal#privacy" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">{t("footer.privacyPolicy")}</Link></li>
                  <li><Link href="/legal#terms" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">{t("footer.termsOfService")}</Link></li>
                  <li><Link href="/legal#cookies" className="text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 transition-colors">{t("footer.cookiePolicy")}</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 dark:border-gray-700 pt-6 sm:flex-row">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" className="w-8 h-8 shrink-0" aria-hidden>
                  <polygon points="20,70 60,70 40,40" fill="#008387" stroke="#008387" strokeWidth="5" strokeLinejoin="round"/>
                  <polygon points="26,32 54,32 40,10" fill="#143562" stroke="#143562" strokeWidth="5" strokeLinejoin="round"/>
                </svg>
                <p className="text-xs text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} {t("footer.copyright")}.</p>
              </div>
              <div className="flex gap-4">
                <Link href="/blog" className="text-xs text-gray-500 dark:text-gray-400 hover:text-brand-600 transition-colors">{t("nav.blog")}</Link>
              </div>
            </div>
          </div>
        </footer></ShowWhenNotEmbed>
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
      </CurrencyProvider>
      </body>
    </html>
  );
}
