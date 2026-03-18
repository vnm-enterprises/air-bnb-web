"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart, User, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProfileModal from "@/components/ui/ProfileModal";

export default function Header() {
  const { isAuthenticated, user, logout, isHost, isTraveler, loading } = useAuth();
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
      ? "text-black font-semibold"
      : "text-gray-600 hover:text-black";

  const handleNavigate = (path: string) => {
    router.push(path);
    setMobileOpen(false);
    setProfileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-[1000] w-full border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-xl font-bold tracking-tight text-black sm:text-2xl">
            PropBNB
          </Link>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                  onClick={() => setProfileMenuOpen(false)}
                className={`transition-colors duration-200 ${isActive(link.href)}`}
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
                  className="text-sm text-gray-600 transition hover:text-black"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="rounded-full bg-[#2C5F5D] px-4 py-2 text-sm text-white transition hover:bg-[#244f4d]"
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
                    className="text-sm text-gray-600 transition hover:text-black"
                  >
                    Host Dashboard
                  </Link>
                )}

                {isTraveler() && (
                  <button
                    onClick={() => handleNavigate("/wishlist")}
                    className="rounded-full p-2 transition hover:bg-gray-100"
                    aria-label="Open wishlist"
                  >
                    <Heart className="h-5 w-5 text-gray-700" />
                  </button>
                )}

                <div className="relative" ref={profileMenuRef}>
                  <button
                    className="rounded-full p-2 transition hover:bg-gray-100"
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                    aria-expanded={profileMenuOpen}
                    aria-haspopup="menu"
                    aria-label="Open profile menu"
                  >
                    <User className="h-5 w-5 text-gray-700" />
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
            className="rounded-lg p-2 transition hover:bg-gray-100 md:hidden"
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
            className="fixed inset-0 z-[1000] bg-black/40"
          />

          <div className="fixed right-0 top-0 z-[1001] flex h-full w-[86vw] max-w-xs flex-col bg-white p-6 shadow-xl sm:w-80">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-xl font-bold">PropBNB</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close mobile menu">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col gap-5 text-sm">
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

            <div className="my-6 border-t" />

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
                  className="rounded-full bg-[#2C5F5D] py-2 text-white"
                >
                  Sign Up
                </button>
              </div>
            )}

            {isAuthenticated && !loading && (
              <div className="flex flex-col gap-4 text-sm">
                <div className="border-b px-2 py-2">
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
                  onClick={() => {
                    setMobileOpen(false);
                    setProfileModalOpen(true);
                  }}
                  className="text-left text-gray-600 hover:text-black"
                >
                  Profile Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-left text-red-600 hover:text-red-700"
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
