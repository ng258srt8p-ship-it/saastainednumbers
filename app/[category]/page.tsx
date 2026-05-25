import { getCalculatorsByCategory, getCategories, CATEGORY_META, getAllKnownCategories } from "@/lib/registry";
import Link from "next/link";
import { CalculatorSearch } from "@/components/CalculatorSearch";
import { Breadcrumb } from "@/components/Breadcrumb";

import "@/calculators/config/_all";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const registered = getCategories();
  const known = getAllKnownCategories();
  const all = new Set([...registered, ...known]);
  return Array.from(all).map((cat) => ({ category: cat }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const meta = CATEGORY_META[category];
  const name = meta?.name ?? category.charAt(0).toUpperCase() + category.slice(1);

  return {
    title: `${name} Calculators`,
    description: meta?.description ?? `Browse our collection of ${category} calculators.`,
    alternates: {
      canonical: `https://saastainednumbers.com/${category}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const calculators = getCalculatorsByCategory(category);
  const meta = CATEGORY_META[category];
  const categoryName = meta?.name ?? category.charAt(0).toUpperCase() + category.slice(1);

  if (calculators.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-heading text-3xl font-bold mb-2">{categoryName} Calculators</h1>
        <p className="text-gray-600 mb-8">{meta?.description}</p>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-lg text-gray-600">Calculators in this category are coming soon.</p>
          <p className="mt-2 text-sm text-gray-500">We are building them now. Check back soon!</p>
          <Link href="/" className="mt-6 inline-block text-sm font-medium text-brand-600 hover:text-brand-700 underline">
            Browse all categories &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: categoryName, href: `/${category}` },
        ]} />
        <h1 className="font-heading text-3xl font-bold mb-2">{categoryName} Calculators</h1>
        <p className="text-gray-600 mb-6">{meta?.description}</p>
        <div className="mb-8">
          <CalculatorSearch
            calculators={calculators.map((c) => ({
              slug: c.slug,
              category: c.category,
              title: c.meta.title,
              description: c.meta.description,
            }))}
            placeholder={`Search ${categoryName.toLowerCase()} calculators...`}
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {calculators.map((calc) => (
            <Link
              key={calc.slug}
              href={`/${calc.category}/${calc.slug}`}
              className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">{calc.meta.title}</h2>
              </div>
              <p className="mt-2 text-sm text-gray-600">{calc.meta.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
