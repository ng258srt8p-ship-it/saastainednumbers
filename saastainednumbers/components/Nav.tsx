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
    <nav className="sticky top-0 z-50 border-b border-gray-100/80 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-5">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="SaaStainedNumbers" width={40} height={40} className="shrink-0" unoptimized />
          <span className="font-heading text-xl font-bold bg-gradient-to-r from-brand-500 to-brand-900 bg-clip-text text-transparent tracking-tight">
            SaaStainedNumbers
          </span>
        </Link>
        <MobileNav t={links} />
      </div>
    </nav>
  );
}
