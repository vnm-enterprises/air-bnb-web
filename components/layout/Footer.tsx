"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#306966] border-t mt-20">

      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm text-white">

        {/* Support */}
        <div>
          <h3 className="font-semibold mb-4">Support</h3>
          <ul className="space-y-3">
            <li><Link href="#" className="hover:underline">Help Center</Link></li>
            <li><Link href="#" className="hover:underline">Safety Information</Link></li>
            <li><Link href="#" className="hover:underline">Cancellation Options</Link></li>
            <li><Link href="#" className="hover:underline">Report Concern</Link></li>
          </ul>
        </div>

        {/* Hosting */}
        <div>
          <h3 className="font-semibold mb-4">Hosting</h3>
          <ul className="space-y-3">
            <li><Link href="#" className="hover:underline">Become a Host</Link></li>
            <li><Link href="#" className="hover:underline">Host Resources</Link></li>
            <li><Link href="#" className="hover:underline">Community Forum</Link></li>
            <li><Link href="#" className="hover:underline">Responsible Hosting</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-3">
            <li><Link href="#" className="hover:underline">About</Link></li>
            <li><Link href="#" className="hover:underline">Careers</Link></li>
            <li><Link href="#" className="hover:underline">Press</Link></li>
            <li><Link href="#" className="hover:underline">Investors</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold mb-4">Legal</h3>
          <ul className="space-y-3">
            <li><Link href="#" className="hover:underline">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:underline">Terms of Service</Link></li>
            <li><Link href="#" className="hover:underline">Cookie Policy</Link></li>
            <li><Link href="#" className="hover:underline">Accessibility</Link></li>
          </ul>
        </div>

      </div>

      {/* BOTTOM SECTION */}
      <div className="border-t border-white">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-white gap-4">

          <div className="text-center md:text-left">
            © {new Date().getFullYear()} PropBNB. All rights reserved.
          </div>

          <div className="text-center">
            Designed & Developed by{" "}
            <a
              href="https://maximumeffortlk.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
            >
              MES
            </a>
          </div>

        </div>
      </div>

    </footer>
  );
}
