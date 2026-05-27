import { getAllCalculators, getCategories, getAllKnownCategories } from "@/lib/registry";
import { getAllPosts } from "@/lib/blog";
import "@/calculators/config/_all";

export const dynamic = "force-static";

export default async function sitemap() {
  const calculators = getAllCalculators();
  const registered = getCategories();
  const known = getAllKnownCategories();
  const categories = Array.from(new Set([...registered, ...known]));
  const posts = getAllPosts();

  const calculatorPages = calculators.map((calc) => ({
    url: `https://saastainednumbers.com/${calc.category}/${calc.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages = categories.map((cat) => ({
    url: `https://saastainednumbers.com/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const embedPages = calculators.map((calc) => ({
    url: `https://saastainednumbers.com/embed/${calc.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.3,
  }));

  const blogPages = posts.map((post) => ({
    url: `https://saastainednumbers.com/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const staticPages = [
    { url: "https://saastainednumbers.com/", lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: "https://saastainednumbers.com/dashboard", lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: "https://saastainednumbers.com/blog", lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.6 },
    { url: "https://saastainednumbers.com/pricing", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: "https://saastainednumbers.com/calculators", lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: "https://saastainednumbers.com/legal", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  return [...staticPages, ...categoryPages, ...calculatorPages, ...embedPages, ...blogPages];
}
