import { getAllPosts } from "@/lib/blog";
import { AdSlot } from "@/components/AdSlot";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getAllPosts().find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://saastainednumbers.com/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getAllPosts().find((p) => p.slug === slug);
  if (!post) notFound();

  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `https://saastainednumbers.com/blog/${slug}`,
    author: {
      "@type": "Organization",
      name: "SaaStainedNumbers",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/blog" className="text-sm text-brand-600 hover:text-brand-700 mb-4 inline-block">
          &larr; Back to Blog
        </Link>
        <article>
          <header className="mb-8">
            <time className="text-sm text-gray-500">{post.date}</time>
            <h1 className="font-heading text-3xl font-bold mt-1">{post.title}</h1>
            <p className="text-gray-600 mt-2">{post.description}</p>
          </header>
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className="mt-8">
            <AdSlot placement="below-results" />
          </div>
        </article>
      </div>
    </>
  );
}
