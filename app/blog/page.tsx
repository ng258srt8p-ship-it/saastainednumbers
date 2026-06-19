import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import { alternateLanguages, localeUrl } from "@/lib/locale-url";
import { getTranslations } from "@/lib/getTranslations";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return {
    title: `${t("blog.title")} - SaaStainedNumbers`,
    description: t("blog.subtitle"),
    alternates: {
      canonical: localeUrl("/blog"),
      languages: alternateLanguages("/blog"),
    },
    openGraph: {
      title: `${t("blog.title")} - SaaStainedNumbers`,
      description: t("blog.subtitle"),
      type: "website",
      images: ["/api/og?title=Blog&category=home"],
    },
  };
}

export default async function BlogPage() {
  const { t } = await getTranslations();
  const posts = getAllPosts();

  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12">
        <h1 className="font-heading text-3xl font-bold text-gray-900 dark:text-gray-100">{t("blog.title")}</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {t("blog.subtitle")}
        </p>
      </div>

      {featured && (
        <section className="mb-16">
          <h2 className="mobbin-label mb-4">{t("blog.featuredPost")}</h2>
          <Link
            href={`/blog/${featured.slug}`}
            className="group block rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div className="h-40 bg-gradient-to-br from-brand-500 to-brand-700 flex items-end p-6">
              <time className="text-xs font-medium text-white/70">{featured.date}</time>
            </div>
            <div className="p-6">
              <h3 className="font-heading text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400">
                {featured.title}
              </h3>
              <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">{featured.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400">
                {t("blog.readArticle")} →
              </span>
            </div>
          </Link>
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <h2 className="mobbin-label mb-4">{t("blog.allArticles")}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group mobbin-card-hover"
              >
                <time className="text-xs text-gray-500 dark:text-gray-400">{post.date}</time>
                <h3 className="mt-1 font-heading text-base font-semibold text-gray-900 dark:text-gray-100 transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{post.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
