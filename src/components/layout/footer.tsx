export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">GlbBus</h3>
            <p className="text-xs text-slate-500">
              AI-powered B2B industrial sourcing platform connecting global buyers with
              verified manufacturers.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Products</h3>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>Aluminum Profiles</li>
              <li>Fasteners & Hardware</li>
              <li>Electrical Components</li>
              <li>Industrial Machinery</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Company</h3>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>About Us</li>
              <li>Supplier Network</li>
              <li>Quality Assurance</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Contact</h3>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>sales@glbbus.com</li>
              <li>WhatsApp: +86 ...</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} GlbBus. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
