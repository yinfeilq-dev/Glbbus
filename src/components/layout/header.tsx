// 导航组件
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-blue-600">
          GlbBus
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-500 md:flex">
          <Link href="/products" className="font-medium text-slate-900 hover:text-blue-600">
            Products
          </Link>
          <Link href="/suppliers" className="hover:text-blue-600">
            Suppliers
          </Link>
          <Link href="/about" className="hover:text-blue-600">
            About
          </Link>
          <Link href="/contact" className="hover:text-blue-600">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <select
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500"
            defaultValue="en"
          >
            <option value="en">EN</option>
            <option value="zh">中文</option>
            <option value="ru">РУС</option>
            <option value="es">ES</option>
          </select>
        </div>
      </div>
    </header>
  );
}
