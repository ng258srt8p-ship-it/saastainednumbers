import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import { SidekickAd } from "@/components/SidekickAd";

export const metadata: Metadata = {
  title: "Blog  -  SaaStainedNumbers",
  description: "SaaS metrics insights, tutorials, and industry benchmarks. Learn how to calculate and improve MRR, CAC, LTV, churn, and more.",
  alternates: {
    canonical: "https://saastainednumbers.com/blog",
  },
  openGraph: {
    title: "Blog  -  SaaStainedNumbers",
    description: "SaaS metrics insights, tutorials, and industry benchmarks. Learn how to calculate and improve MRR, CAC, LTV, churn, and more.",
    images: ["/api/og?title=Blog&category=home"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog  -  SaaStainedNumbers",
    description: "SaaS metrics insights, tutorials, and industry benchmarks. Learn how to calculate and improve MRR, CAC, LTV, churn, and more.",
    images: ["/api/og?title=Blog&category=home"],
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12">
        <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-gray-100">Blog</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          SaaS metrics insights, tutorials, and industry benchmarks.
        </p>
      </div>

      <div className="my-8">
        <SidekickAd />
      </div>

      {featured && (
        <section className="mb-16">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Featured Post</h2>
          <Link
            href={`/blog/${featured.slug}`}
            className="group block rounded-2xl border border-gray-100 dark:border-gray-700 bg-gradient-to-br from-brand-50 dark:from-brand-900/30 to-white dark:to-gray-800 p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <time className="text-sm text-gray-500 dark:text-gray-400">{featured.date}</time>
            <h3 className="mt-2 font-heading text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400">
              {featured.title}
            </h3>
            <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">{featured.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400">
              Read article <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </span>
          </Link>
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">All Articles</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <time className="text-xs text-gray-500 dark:text-gray-400">{post.date}</time>
                <h3 className="mt-1 font-heading text-base font-semibold text-gray-900 dark:text-gray-100 transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{post.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 opacity-0 transition-opacity group-hover:opacity-100">
                  Read more <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
