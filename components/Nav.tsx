import { getTranslations } from "@/lib/getTranslations";
import Link from "next/link";
import Image from "next/image";
import { MobileNav } from "./MobileNav";

export async function Nav() {
  const { t } = await getTranslations();
  const links = {
    dashboard: t("nav.dashboard"),
    pricing: t("nav.pricing"),
    blog: t("nav.blog"),
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-5">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="SaaStainedNumbers" width={40} height={40} className="shrink-0" unoptimized />
          <span className="font-heading text-xl font-bold bg-gradient-to-r from-brand-500 to-brand-900 bg-clip-text text-transparent tracking-tight">
            SaaStainedNumbers
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <MobileNav t={links} />
        </div>
      </div>
    </nav>
  );
}
