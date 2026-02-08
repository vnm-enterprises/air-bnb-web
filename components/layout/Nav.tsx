'use client'

import Link from "next/link";

const links = [
  { label: "Explore", href: "#", active: true },
  { label: "Become a Host", href: "#" },
  { label: "Support", href: "#" },
];

export default function Nav() {
  return (
    <nav className="hidden md:flex items-center gap-8">
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className={`text-sm font-bold transition-colors ${
            link.active
              ? "nav-link-active"
              : "text-slate-600 dark:text-slate-400 hover:text-[#2C5F5D]"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
