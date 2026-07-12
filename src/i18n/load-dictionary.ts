/**
 * 按 locale 加载翻译字典
 * 使用 dynamic import 实现 code splitting（每个语言单独 chunk）
 */

import type { Locale } from "./config";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  zh: () => import("./dictionaries/zh.json").then((m) => m.default),
  ru: () => import("./dictionaries/ru.json").then((m) => m.default),
  es: () => import("./dictionaries/es.json").then((m) => m.default),
  ar: () => import("./dictionaries/ar.json").then((m) => m.default),
} as const satisfies Record<Locale, () => Promise<Record<string, unknown>>>;

type Dict = Awaited<ReturnType<(typeof dictionaries)[Locale]>>;

/** 加载字典 */
export async function loadDictionary(locale: Locale): Promise<Dict> {
  const loader = dictionaries[locale] ?? dictionaries.en;
  return (await loader()) as Dict;
}

type DotKey<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? DotKey<T[K], `${Prefix}${K}.`>
    : `${Prefix}${K}`;
}[keyof T & string];

/** 字典的 key 路径类型 */
export type DictKey = DotKey<Dict>;

/** 根据点分路径取字典值 */
export function t(dict: Dict, key: string, params?: Record<string, string | number>): string {
  const parts = key.split(".");
  let value: unknown = dict;
  for (const part of parts) {
    if (value && typeof value === "object" && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return key; // fallback: 返回 key 本身
    }
  }

  if (typeof value !== "string") return key;

  // 替换参数 {param}
  if (params) {
    return value.replace(/\{(\w+)\}/g, (_, p) => String(params[p] ?? `{${p}}`));
  }

  return value;
}
