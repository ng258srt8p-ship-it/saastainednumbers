import { getAllCalculators, getCategories } from "@/lib/registry";
import { getAllPosts } from "@/lib/blog";

export default async function sitemap() {
  const calculators = getAllCalculators();
  const categories = getCategories();
  const posts = getAllPosts();

  const calculatorPages = calculators.map((calc) => ({
    url: `https://saasifactory.io/${calc.category}/${calc.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages = categories.map((cat) => ({
    url: `https://saasifactory.io/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const embedPages = calculators.map((calc) => ({
    url: `https://saasifactory.io/embed/${calc.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.3,
  }));

  const blogPages = posts.map((post) => ({
    url: `https://saasifactory.io/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const staticPages = [
    { url: "https://saasifactory.io/", lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: "https://saasifactory.io/dashboard", lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: "https://saasifactory.io/blog", lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.6 },
    { url: "https://saasifactory.io/prelaunch", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: "https://saasifactory.io/request-calculator", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: "https://saasifactory.io/pricing", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: "https://saasifactory.io/calculators", lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  return [...staticPages, ...categoryPages, ...calculatorPages, ...embedPages, ...blogPages];
}
