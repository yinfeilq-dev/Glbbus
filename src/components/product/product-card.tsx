/**
 * 产品卡片组件（多语言支持）
 */

import type { Product } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import Link from "next/link";
import { localizedPath } from "@/i18n/config";

type Props = {
  product: Product;
  locale: Locale;
  dict: Record<string, unknown>;
  supplierName?: string;
};

export default function ProductCard({ product, locale, dict, supplierName }: Props) {
  const common = (dict.common as Record<string, string>) ?? {};

  return (
    <Link href={localizedPath(locale, `/products/${product.sku}`)}>
      <div className="rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md">
        <div className="mb-3 flex h-36 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-400">
          📷 Product Image
        </div>
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
          {product.name_en}
        </h3>
        {supplierName && (
          <p className="mt-1 text-xs text-slate-400">{supplierName}</p>
        )}
        {product.base_price && (
          <p className="mt-2 text-base font-bold text-blue-600">
            ${product.base_price.toFixed(2)}
            <span className="text-xs font-normal text-slate-400">
              {product.base_price < 50 ? "/pc" : "/kg"}
            </span>
          </p>
        )}
        {product.certifications.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.certifications.map((c) => (
              <span
                key={c}
                className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
