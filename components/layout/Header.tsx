"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart, User, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProfileModal from "@/components/ui/ProfileModal";

export default function Header() {
  const { isAuthenticated, user, logout, isHost, isTraveler, isAdmin, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (!profileMenuRef.current) {
        return;
      }

      if (!profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener("mousedown", onOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", onOutsideClick);
    };
  }, [profileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    setProfileMenuOpen(false);
    router.push("/login");
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "Support", href: "/support" },
  ];

  const isActive = (href: string) =>
    pathname === href
      ? "bg-white text-slate-950 shadow-sm"
      : "text-slate-600 hover:bg-white/80 hover:text-slate-950";

  const handleNavigate = (path: string) => {
    router.push(path);
    setMobileOpen(false);
    setProfileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-1000 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
          <Link
            href="/"
            className="bg-linear-to-r from-[#1f4d4a] via-[#2C5F5D] to-[#5f8f84] bg-clip-text text-2xl font-black tracking-[-0.04em] text-transparent sm:text-4xl py-2"
          >
            PropBnB
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-slate-100/80 px-2 py-2 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setProfileMenuOpen(false)}
                className={`rounded-full px-5 py-2.5 text-base font-semibold transition-all duration-200 ${isActive(link.href)}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            {!isAuthenticated && !loading && (
              <>
                <Link
                  href="/login"
                  className="text-base font-medium text-slate-600 transition hover:text-slate-950"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="rounded-full bg-[#2C5F5D] px-5 py-2.5 text-base font-semibold text-white shadow-lg shadow-[#2C5F5D]/20 transition hover:bg-[#244f4d]"
                >
                  Sign Up
                </Link>
              </>
            )}

            {isAuthenticated && !loading && (
              <>
                {isAdmin() && (
                  <Link
                    href="/admin"
                    className="text-base font-medium text-slate-600 transition hover:text-slate-950"
                  >
                    Admin Panel
                  </Link>
                )}

                {isHost() && (
                  <Link
                    href="/host"
                    className="text-base font-medium text-slate-600 transition hover:text-slate-950"
                  >
                    Host Dashboard
                  </Link>
                )}

                {isTraveler() && (
                  <button
                    onClick={() => handleNavigate("/wishlist")}
                    className="rounded-full p-2.5 transition hover:bg-slate-100"
                    aria-label="Open wishlist"
                  >
                    <Heart className="h-5 w-5 text-slate-700" />
                  </button>
                )}

                <div className="relative" ref={profileMenuRef}>
                  <button
                    className="rounded-full p-2.5 transition hover:bg-slate-100"
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                    aria-expanded={profileMenuOpen}
                    aria-haspopup="menu"
                    aria-label="Open profile menu"
                  >
                    <User className="h-5 w-5 text-slate-700" />
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg">
                      <div className="border-b px-4 py-3">
                        <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
                        <p className="truncate text-xs text-slate-500">{user?.email}</p>
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
                          onClick={() => {
                            setProfileMenuOpen(false);
                            setProfileModalOpen(true);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                          Profile Settings
                        </button>

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-xl border border-slate-200 bg-white/90 p-2.5 shadow-sm transition hover:bg-slate-50 md:hidden"
            aria-label="Open mobile menu"
          >
            <Menu className="h-6 w-6 text-gray-800" />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-1000 bg-slate-950/45 backdrop-blur-sm"
          />

          <div className="fixed right-0 top-0 z-1001 flex h-full w-[88vw] max-w-sm flex-col overflow-hidden border-l border-slate-200/70 bg-linear-to-b from-white via-[#f7fbfb] to-[#edf5f4] p-6 shadow-2xl shadow-slate-900/15 sm:w-96">
            <div className="mb-8 flex items-center justify-between">
              <span className="bg-linear-to-r from-[#1f4d4a] via-[#2C5F5D] to-[#5f8f84] bg-clip-text text-3xl font-black tracking-[-0.04em] text-transparent">
                PropBnb
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close mobile menu"
                className="rounded-full border border-slate-200 bg-white/90 p-2 text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="rounded-[28px] border border-[#d7e7e5] bg-white/80 p-3 shadow-lg shadow-[#2C5F5D]/8 backdrop-blur">
              <div className="mb-3 px-3">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2C5F5D]">Explore</p>
              </div>

              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavigate(link.href)}
                    className={`rounded-2xl px-4 py-3 text-left text-lg font-semibold transition-all duration-200 ${isActive(link.href)}`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="my-6 border-t border-slate-200/80" />

            {!isAuthenticated && !loading && (
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleNavigate("/login")}
                  className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-left text-lg font-medium text-slate-700 shadow-sm transition hover:bg-white"
                >
                  Login
                </button>

                <button
                  onClick={() => handleNavigate("/signup")}
                  className="rounded-2xl bg-[#2C5F5D] px-4 py-3 text-lg font-semibold text-white shadow-lg shadow-[#2C5F5D]/20 transition hover:bg-[#244f4d]"
                >
                  Sign Up
                </button>
              </div>
            )}

            {isAuthenticated && !loading && (
              <div className="flex flex-col gap-4">
                <div className="rounded-3xl border border-[#d7e7e5] bg-white/85 px-4 py-4 shadow-sm">
                  <p className="text-base font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>

                {isAdmin() && (
                  <button
                    onClick={() => handleNavigate("/admin")}
                    className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-left text-lg font-medium text-slate-700 transition hover:bg-white hover:text-slate-950"
                  >
                    Admin Panel
                  </button>
                )}

                {isHost() && (
                  <button
                    onClick={() => handleNavigate("/host")}
                    className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-left text-lg font-medium text-slate-700 transition hover:bg-white hover:text-slate-950"
                  >
                    Host Dashboard
                  </button>
                )}

                {isTraveler() && (
                  <>
                    <button
                      onClick={() => handleNavigate("/dashboard")}
                      className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-left text-lg font-medium text-slate-700 transition hover:bg-white hover:text-slate-950"
                    >
                      My Bookings
                    </button>

                    <button
                      onClick={() => handleNavigate("/wishlist")}
                      className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-left text-lg font-medium text-slate-700 transition hover:bg-white hover:text-slate-950"
                    >
                      Wishlist
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setProfileModalOpen(true);
                  }}
                  className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 text-left text-lg font-medium text-slate-700 transition hover:bg-white hover:text-slate-950"
                >
                  Profile Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50/90 px-4 py-3 text-left text-lg font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </>
  );
}
