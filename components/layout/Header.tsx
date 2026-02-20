/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart, User, Menu, X } from "lucide-react";

interface UserType {
  name: string;
  avatar?: string;
}

export default function Header() {
  const [user, setUser] = useState<UserType | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "Support", href: "/support" },
  ];

  const isActive = (href: string) =>
    pathname === href
      ? "text-black font-semibold"
      : "text-gray-600 hover:text-black";

  const handleNavigate = (path: string) => {
    router.push(path);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-[1000]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <Link href="/" className="text-2xl font-bold tracking-tight text-black">
              PropBNB
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-8 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors duration-200 ${isActive(link.href)}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* RIGHT SECTION DESKTOP */}
            <div className="hidden md:flex items-center gap-4">

              {!user && (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-gray-600 hover:text-black transition"
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    className="text-sm bg-[#306966] text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {user && (
                <>
                  <button
                    onClick={() => router.push("/wishlist")}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <Heart className="w-5 h-5 text-gray-700" />
                  </button>

                  <button
                    onClick={() => router.push("/profile")}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-700" />
                    )}
                  </button>
                </>
              )}
            </div>

            {/* MOBILE HAMBURGER */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Menu className="w-6 h-6 text-gray-800" />
            </button>

          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <>
          {/* BACKDROP */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 z-[1000]"
          />

          {/* PANEL */}
          <div className="fixed top-0 right-0 h-full w-72 bg-white z-[1001] shadow-xl p-6 flex flex-col transition-transform duration-300">

            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold">PropBNB</span>
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* NAV LINKS */}
            <div className="flex flex-col gap-6 text-sm">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavigate(link.href)}
                  className={`text-left ${isActive(link.href)}`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="border-t my-6" />

            {/* AUTH SECTION */}
            {!user && (
              <div className="flex flex-col gap-4 text-sm">
                <button
                  onClick={() => handleNavigate("/login")}
                  className="text-left text-gray-600"
                >
                  Login
                </button>

                <button
                  onClick={() => handleNavigate("/signup")}
                  className="bg-black text-white py-2 rounded-full"
                >
                  Sign Up
                </button>
              </div>
            )}

            {user && (
              <div className="flex flex-col gap-4 text-sm">
                <button
                  onClick={() => handleNavigate("/wishlist")}
                  className="text-left"
                >
                  Wishlist
                </button>

                <button
                  onClick={() => handleNavigate("/profile")}
                  className="text-left"
                >
                  Profile
                </button>
              </div>
            )}

          </div>
        </>
      )}
    </>
  );
}
