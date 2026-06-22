import { getAllCalculators, getCategories, getAllKnownCategories } from "@/lib/registry";
import { getAllPosts } from "@/lib/blog";
import "@/calculators/config/_all";

export const dynamic = "force-static";

const LOCALES = ["en", "es", "de", "pt", "fr", "ja"];
const BASE = "https://saastainednumbers.com";

function localeUrl(path: string, locale: string): string {
  return locale === "en" ? `${BASE}${path}` : `${BASE}/${locale}${path}`;
}

function alternateLanguages(path: string): Record<string, string> {
  return Object.fromEntries(LOCALES.map((l) => [l, localeUrl(path, l)]));
}

export default async function sitemap() {
  const calculators = getAllCalculators();
  const registered = getCategories();
  const known = getAllKnownCategories();
  const categories = Array.from(new Set([...registered, ...known]));
  const posts = getAllPosts();

  const calculatorPages = calculators.map((calc) => {
    const path = `/${calc.category}/${calc.slug}`;
    return {
      url: localeUrl(path, "en"),
      alternates: { languages: alternateLanguages(path) },
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

  const categoryPages = categories.map((cat) => {
    const path = `/${cat}`;
    return {
      url: localeUrl(path, "en"),
      alternates: { languages: alternateLanguages(path) },
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

  const blogPages = posts.map((post) => {
    const path = `/blog/${post.slug}`;
    return {
      url: localeUrl(path, "en"),
      alternates: { languages: alternateLanguages(path) },
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  const staticPageDefs = [
    { path: "/", pri: 1.0, freq: "weekly" as const },
    { path: "/blog", pri: 0.6, freq: "daily" as const },
    { path: "/pricing", pri: 0.5, freq: "monthly" as const },
    { path: "/calculators", pri: 0.8, freq: "weekly" as const },
    { path: "/legal", pri: 0.3, freq: "monthly" as const },
    { path: "/privacy", pri: 0.3, freq: "monthly" as const },
    { path: "/terms", pri: 0.3, freq: "monthly" as const },
  ];

  const staticPages = staticPageDefs.map(({ path, pri, freq }) => ({
    url: localeUrl(path, "en"),
    alternates: { languages: alternateLanguages(path) },
    lastModified: new Date(),
    changeFrequency: freq,
    priority: pri,
  }));

  return [...staticPages, ...categoryPages, ...calculatorPages, ...blogPages];
}
