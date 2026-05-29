import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import "@/calculators/config/_all";
import { KNOWN_CATEGORIES, getAllCalculators, getCategoryTranslationKey } from "@/lib/registry";
import type { SupportedLocale } from "@/calculators/config/calculator-schema";

const LOCALES: SupportedLocale[] = ["en", "es", "de", "pt", "fr", "ja"];
const NON_EN_LOCALES = LOCALES.filter((l) => l !== "en");

function loadLocale(locale: string): Record<string, unknown> {
  const p = path.resolve(__dirname, "..", "i18n", locale, "common.json");
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function getLeafKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      keys.push(...getLeafKeys(v as Record<string, unknown>, p));
    } else {
      keys.push(p);
    }
  }
  return keys;
}

function keyExists(msgs: Record<string, unknown>, dottedKey: string): boolean {
  let current: unknown = msgs;
  for (const part of dottedKey.split(".")) {
    if (!current || typeof current !== "object") return false;
    current = (current as Record<string, unknown>)[part];
    if (current === undefined) return false;
  }
  return true;
}

describe("locale completeness", () => {
  const enMsgs = loadLocale("en");
  const enKeys = new Set(getLeafKeys(enMsgs));
  const localeMessages = Object.fromEntries(
    LOCALES.map((l) => [l, loadLocale(l)]),
  );

  for (const locale of NON_EN_LOCALES) {
    it(`${locale}: all en keys exist`, () => {
      const missing: string[] = [];
      for (const key of enKeys) {
        if (!keyExists(localeMessages[locale], key)) {
          missing.push(key);
        }
      }
      expect(missing,
        `${locale} is missing ${missing.length} en keys:\n${missing.join("\n")}`,
      ).toEqual([]);
    });
  }

  it("no locale file has extra keys not in en", () => {
    for (const locale of NON_EN_LOCALES) {
      const extra = getLeafKeys(localeMessages[locale]).filter((k) => !enKeys.has(k));
      expect(extra,
        `${locale} has ${extra.length} keys not present in en:\n${extra.join("\n")}`,
      ).toEqual([]);
    }
  });

  it("every category translation key exists in all 6 locales", () => {
    for (const slug of KNOWN_CATEGORIES) {
      const key = getCategoryTranslationKey(slug);
      for (const locale of LOCALES) {
        const exists = keyExists(localeMessages[locale], `category.${key}`);
        expect(exists,
          `${locale}: category.${key} (from slug "${slug}") is missing`,
        ).toBe(true);
      }
    }
  });
});

describe("category slug→key mapping", () => {
  it("every KNOWN_CATEGORIES slug maps to a valid translation key", () => {
    for (const slug of KNOWN_CATEGORIES) {
      const key = getCategoryTranslationKey(slug);
      expect(key, `"${slug}" maps to "${key}"`).toBeTruthy();
    }
  });

  it("mapped keys are unique (no two slugs map to the same key)", () => {
    const keys = KNOWN_CATEGORIES.map((s) => getCategoryTranslationKey(s));
    const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
    expect(dupes, `Duplicate translation keys: ${dupes.join(", ")}`).toEqual([]);
  });
});

describe("calculator locale overrides", () => {
  const calculators = getAllCalculators();
  const withLocales = calculators.filter((c) => c.locales && Object.keys(c.locales).length > 0);
  const withoutLocales = calculators.filter((c) => !c.locales || Object.keys(c.locales).length === 0);

  it("at least 6 calculators have locale overrides", () => {
    expect(withLocales.length).toBeGreaterThanOrEqual(6);
  });

  for (const calc of withLocales) {
    describe(`${calc.slug} locale overrides`, () => {
      const definedLocales = NON_EN_LOCALES.filter((l) => calc.locales![l]);

      it(`has locale overrides for: ${definedLocales.join(", ") || "none"}`, () => {
        expect(definedLocales.length).toBeGreaterThan(0);
      });

      for (const locale of definedLocales) {
        it(`${locale}: has meta.title and meta.description`, () => {
          const override = calc.locales![locale]!;
          expect(override.meta?.title,
            `${calc.slug}[${locale}].meta.title is missing`,
          ).toBeDefined();
          expect(override.meta?.description,
            `${calc.slug}[${locale}].meta.description is missing`,
          ).toBeDefined();
        });
      }
    });
  }
});
