export default function Footer() {
  return (
    <footer className="mt-20">
      <div
        className="
        bg-[#2C5F5D]
        text-white
        "
      >
        <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">

          <div>
            <h3 className="text-xl font-bold mb-4">StayFound</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Your trusted partner in finding the perfect home.
              We make real estate simple.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <FooterLink>Buy Property</FooterLink>
            <FooterLink>Sell Property</FooterLink>
            <FooterLink>Rent Property</FooterLink>
            <FooterLink>About Us</FooterLink>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Property Types</h4>
            <FooterLink>Houses</FooterLink>
            <FooterLink>Apartments</FooterLink>
            <FooterLink>Condos</FooterLink>
            <FooterLink>Villas</FooterLink>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>

            <div className="space-y-2 text-white/80 text-sm">
              <p>(555) 123-4567</p>
              <p>info@stayfound.com</p>
              <p>123 Main St, City</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-5 text-center text-sm text-white/70">
            © {new Date().getFullYear()} StayFound. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Reusable Footer Link */
function FooterLink({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-white/80 hover:text-white transition cursor-pointer text-sm mb-2">
      {children}
    </div>
  );
}
