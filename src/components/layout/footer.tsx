/**
 * 页脚组件（多语言支持）
 */

import type { Locale } from "@/i18n/config";

type Props = {
  locale: Locale;
  dict: Record<string, unknown>;
};

export default function Footer({ locale, dict }: Props) {
  const common = (dict.common as Record<string, string>) ?? {};
  const nav = (dict.navigation as Record<string, string>) ?? {};

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              {common.site_name ?? "GlbBus"}
            </h3>
            <p className="text-xs text-slate-500">
              {common.site_tagline ?? ""}
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              {nav.products ?? "Products"}
            </h3>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>Aluminum Profiles</li>
              <li>Fasteners & Hardware</li>
              <li>Electrical Components</li>
              <li>Industrial Machinery</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              {nav.about ?? "Company"}
            </h3>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>{nav.about ?? "About Us"}</li>
              <li>Supplier Network</li>
              <li>Quality Assurance</li>
              <li>{nav.contact ?? "Contact"}</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              {nav.contact ?? "Contact"}
            </h3>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>sales@koudingcloud.com</li>
              <li><a href="https://wa.me/8613651945808" target="_blank" rel="noopener noreferrer" className="hover:text-green-500">WhatsApp: +86 136 5194 5808</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} GlbBus.{" "}
          {common.all_rights_reserved ?? "All rights reserved."}
        </div>
      </div>
    </footer>
  );
}
