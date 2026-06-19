import { getAllCalculators } from "@/lib/registry";
import "@/calculators/config/_all";
import { NextResponse } from "next/server";

export async function GET() {
  const calculators = getAllCalculators().map((calc) => ({
    slug: calc.slug,
    category: calc.category,
    title: calc.meta.title,
    description: calc.meta.description,
    inputs: calc.inputs.map((i) => ({
      id: i.id,
      label: i.label,
      type: i.type,
      defaultValue: i.defaultValue,
      min: i.min,
      max: i.max,
    })),
    outputs: calc.outputs.map((o) => ({
      id: o.id,
      label: o.label,
      type: o.type,
      isPrimary: o.isPrimary,
    })),
  }));

  return NextResponse.json(calculators);
}
