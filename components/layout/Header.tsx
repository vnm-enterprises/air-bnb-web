import Logo from "./Logo";
import Nav from "./Nav";
import AuthActions from "./AuthActions";
import MobileNav from "./MobileNav";

export default function Header() {
  return (
    <header className="absolute top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Logo />
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

