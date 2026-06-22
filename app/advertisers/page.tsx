import type { Metadata } from "next";
import Link from "next/link";
import { alternateLanguages, localeUrl } from "@/lib/locale-url";
import { getTranslations } from "@/lib/getTranslations";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Advertisers & Affiliate Disclosure - SaaStainedNumbers",
    description:
       "Advertising and affiliate disclosure for SaaStainedNumbers. Learn how we monetize and work with advertisers.",
    alternates: {
      canonical: localeUrl("/advertisers"),
      languages: alternateLanguages("/advertisers"),
     },
    openGraph: {
      title: "Advertisers & Affiliate Disclosure - SaaStainedNumbers",
      description:
         "Advertising and affiliate disclosure for SaaStainedNumbers. Learn how we monetize and work with advertisers.",
      type: "website",
      images: ["/api/og?title=Advertisers"],
     },
   };
}

export default async function AdvertisersPage() {
  return (
     <div className="mx-auto max-w-3xl px-4 py-16">
       <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-gray-100">
        Advertiser & Affiliate Disclosure
       </h1>
       <p className="mt-2 text-gray-500 dark:text-gray-400">
        Last updated: May 26, 2026
       </p>

       <hr className="my-8 border-gray-200 dark:border-gray-700" />

       <div className="prose prose-gray dark:prose-invert max-w-none">
         <h2>Affiliate Links</h2>
         <p>
          SaaStainedNumbers participates in various affiliate marketing programs. This means we may earn commissions on qualifying purchases and referrals made through links on our website to retailer sites. When you purchase a product from one of our retailers or services through our links, the retailer knows that your visit was referred through our site. The retailer may make a commission payment to us for referring you. We do not sell, rent, or trade personal information in exchange for commissions. Our affiliate relationships help support the development and maintenance of this free service.
         </p>

         <h2>Advertising</h2>
         <p>
          We may display sponsored advertising content on our website through third-party ad networks such as Google AdSense, EthicalAds, or other affiliated platforms. These advertisements are selected and delivered by the respective ad networks, not by us. Our advertisers do not influence the accuracy of any calculator results or editorial content presented on SaaStainedNumbers. All calculators remain free to use regardless of advertising presence.
         </p>

         <h2>Advertising Partners</h2>
         <p>
          We work with professional advertising networks and affiliate programs that comply with industry standards for online advertising, including but not limited to:
         </p>
         <ul>
          <li>Google AdSense: Google&apos;s advertising platform</li>
          <li>EthicalAds: Privacy-focused advertising network</li>
          <li>Skimlinks: Affiliate link monetization platform</li>
          <li>Various SaaS affiliate programs and retailer partnerships</li>
         </ul>

         <h2>Editorial Independence</h2>
         <p>
          Despite relying on advertising revenue, SaaStainedNumbers maintains full editorial control over all content. Advertisers have no influence over calculator accuracy, benchmark data, or written material published on the platform. Our business model depends on maintaining trust with our users. We will not compromise credibility for revenue.
         </p>

         <h2>Contact</h2>
         <p>
          For advertising partnerships or to inquire about working with us, email <a href="mailto:hello@saastainednumbers.com" className="text-brand-600 dark:text-brand-400">hello@saastainednumbers.com</a>.
        </p>
       </div>

       <hr className="my-8 border-gray-200 dark:border-gray-700" />

       <div className="flex flex-col space-y-2">
         <Link href="/legal" className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 mb-4 inline-block">
          ← Back to Legal
         </Link>
       </div>
     </div>
   );
}