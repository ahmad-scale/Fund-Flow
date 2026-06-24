import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({
  children,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen md:flex">
      <button
        type="button"
        onClick={() => setIsSidebarOpen((open) => !open)}
        aria-label="Toggle navigation"
        aria-expanded={isSidebarOpen}
        className="fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-white shadow-lg transition hover:bg-slate-800 md:hidden"
      >
        <span className="relative h-5 w-5">
          <span
            className={`absolute left-0 top-1 block h-0.5 w-5 rounded bg-white transition-transform duration-300 ${
              isSidebarOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-2.5 block h-0.5 w-5 rounded bg-white transition-opacity duration-300 ${
              isSidebarOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 top-4 block h-0.5 w-5 rounded bg-white transition-transform duration-300 ${
              isSidebarOpen ? "-translate-y-1.5 -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onNavigate={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 p-6 pt-20 md:pt-6">
        {children}
      </div>
    </div>
  );
}
