import type { CalculatorConfig, SupportedLocale } from "@/calculators/config/calculator-schema";

export function resolveLocaleConfig(config: CalculatorConfig, locale: SupportedLocale): CalculatorConfig {
  if (locale === "en" || !config.locales?.[locale]) return config;

  const overrides = config.locales[locale]!;

  const merged: CalculatorConfig = {
    ...config,
    meta: {
      title: overrides.meta?.title ?? config.meta.title,
      description: overrides.meta?.description ?? config.meta.description,
      keywords: overrides.meta?.keywords ?? config.meta.keywords,
    },
    inputs: config.inputs.map((input) => {
      const override = overrides.inputs?.find((o) => o.id === input.id);
      return override ? { ...input, label: override.label ?? input.label } : input;
    }),
    outputs: config.outputs.map((output) => {
      const override = overrides.outputs?.find((o) => o.id === output.id);
      return override ? { ...output, label: override.label ?? output.label } : output;
    }),
    content: {
      ...config.content,
      ...(overrides.content
        ? {
            intro: overrides.content.intro ?? config.content.intro,
            howToUse: overrides.content.howToUse ?? config.content.howToUse,
            formulaExplanation: overrides.content.formulaExplanation ?? config.content.formulaExplanation,
            benchmarks: overrides.content.benchmarks ?? config.content.benchmarks,
            benchmarkData: overrides.content.benchmarkData ?? config.content.benchmarkData,
            faq: overrides.content.faq ?? config.content.faq,
          }
        : {}),
    },
    locales: undefined,
  };

  return merged;
}
