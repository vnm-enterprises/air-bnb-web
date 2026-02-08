import Logo from "./Logo";
import Nav from "./Nav";
import AuthActions from "./AuthActions";
import MobileNav from "./MobileNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#0F1716]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Logo />

          {/* Desktop Navigation */}
          <Nav />

          <div className="flex items-center gap-4">
            <AuthActions />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
