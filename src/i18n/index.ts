import "server-only";
import type { Locale } from "./config";

const dictionaries = {
  es: () => import("./dictionaries/es").then((m) => m.dictionary),
  en: () => import("./dictionaries/en").then((m) => m.dictionary),
  fr: () => import("./dictionaries/fr").then((m) => m.dictionary),
};

/**
 * Deep-widened dictionary shape: literal strings/booleans from `as const`
 * become plain string/boolean so all three locale objects are assignable.
 */
type DeepWiden<T> = T extends string
  ? string
  : T extends boolean
    ? boolean
    : T extends readonly (infer U)[]
      ? readonly DeepWiden<U>[]
      : T extends object
        ? { [K in keyof T]: DeepWiden<T[K]> }
        : T;

export type Dictionary = DeepWiden<
  Awaited<ReturnType<(typeof dictionaries)["en"]>>
>;

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
