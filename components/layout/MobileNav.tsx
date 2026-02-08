"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden relative">
      {/* Hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 z-50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Toggle navigation"
      >
        {open ? <X /> : <Menu />}
      </button>

      {/* Backdrop (dark mode polish) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-14 z-50 w-64 rounded-2xl overflow-hidden
                        bg-white dark:bg-[#1f1f1f]
                        border border-slate-200 dark:border-slate-700
                        shadow-xl dark:shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
        >
          <nav className="flex flex-col p-4 gap-1 text-slate-900 dark:text-slate-100">
            <NavItem>Explore</NavItem>
            <NavItem>Become a Host</NavItem>
            <NavItem>Support</NavItem>

            <div className="my-3 h-px bg-slate-200 dark:bg-slate-700/60" />

            <NavItem>Log In</NavItem>

            <button
              className="mt-2 rounded-full bg-[#2C5F5D]
                         px-4 py-2 font-bold text-white
                         hover:bg-[#244f4d] transition-colors"
            >
              Sign Up
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

/* Reusable nav item */
function NavItem({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="text-left font-semibold px-4 py-2 rounded-lg
                 hover:bg-slate-100 dark:hover:bg-slate-800/70
                 transition-colors"
    >
      {children}
    </button>
  );
}
