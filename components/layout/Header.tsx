/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart, User, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { isAuthenticated, user, logout, isHost, isTraveler, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

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

              {!isAuthenticated && !loading && (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-gray-600 hover:text-black transition"
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    className="text-sm bg-[#2C5F5D] text-white px-4 py-2 rounded-full hover:bg-[#244f4d] transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {isAuthenticated && !loading && (
                <>
                  {isHost() && (
                    <Link
                      href="/host"
                      className="text-sm text-gray-600 hover:text-black transition"
                    >
                      Host Dashboard
                    </Link>
                  )}

                  {isTraveler() && (
                    <button
                      onClick={() => router.push("/wishlist")}
                      className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                      <Heart className="w-5 h-5 text-gray-700" />
                    </button>
                  )}

                  <div className="relative group">
                    <button className="p-2 rounded-full hover:bg-gray-100 transition">
                      <User className="w-5 h-5 text-gray-700" />
                    </button>

                    {/* Dropdown menu */}
                    <div className="absolute right-0 mt-0 w-40 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                      </div>
                      
                      <div className="py-2">
                        {isTraveler() && (
                          <Link
                            href="/dashboard"
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            My Bookings
                          </Link>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
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
            {!isAuthenticated && !loading && (
              <div className="flex flex-col gap-4 text-sm">
                <button
                  onClick={() => handleNavigate("/login")}
                  className="text-left text-gray-600"
                >
                  Login
                </button>

                <button
                  onClick={() => handleNavigate("/signup")}
                  className="bg-[#2C5F5D] text-white py-2 rounded-full"
                >
                  Sign Up
                </button>
              </div>
            )}

            {isAuthenticated && !loading && (
              <div className="flex flex-col gap-4 text-sm">
                <div className="px-2 py-2 border-b">
                  <p className="font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>

                {isHost() && (
                  <button
                    onClick={() => handleNavigate("/host")}
                    className="text-left text-gray-600 hover:text-black"
                  >
                    Host Dashboard
                  </button>
                )}

                {isTraveler() && (
                  <>
                    <button
                      onClick={() => handleNavigate("/dashboard")}
                      className="text-left text-gray-600 hover:text-black"
                    >
                      My Bookings
                    </button>

                    <button
                      onClick={() => handleNavigate("/wishlist")}
                      className="text-left text-gray-600 hover:text-black"
                    >
                      Wishlist
                    </button>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="text-left text-red-600 hover:text-red-700 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}

          </div>
        </>
      )}
    </>
  );
}
