import { getTranslations } from "@/lib/getTranslations";
import Link from "next/link";
import Image from "next/image";
import { AuthNav } from "./AuthNav";
import { LocaleSwitcher } from "./LocaleSwitcher";

export async function Nav() {
  const { t } = await getTranslations();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100/80 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-5">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Saasifactory" width={40} height={36} className="shrink-0" />
          <span className="font-heading text-xl font-bold bg-gradient-to-r from-brand-500 to-brand-900 bg-clip-text text-transparent tracking-tight">
            Saasifactory
          </span>
        </Link>
        <div className="flex items-center gap-5 text-sm text-gray-600">
          <Link href="/calculators" className="transition-colors hover:text-gray-900">Calculators</Link>
          <Link href="/dashboard" className="transition-colors hover:text-gray-900">{t("nav.dashboard")}</Link>
          <Link href="/pricing" className="transition-colors hover:text-gray-900">{t("nav.pricing")}</Link>
          <Link href="/blog" className="transition-colors hover:text-gray-900">{t("nav.blog")}</Link>
          <LocaleSwitcher />
          <AuthNav />
        </div>
      </div>
    </nav>
  );
}
