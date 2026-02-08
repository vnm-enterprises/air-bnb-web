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
          className="text-sm font-semibold transition-colors"
          style={{ color: "#FFFFFF" }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
