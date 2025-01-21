'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";

export function FooterWithCustomDesign() {
  return (
    <footer className="dark-bg text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-[50%_30%_20%] gap-y-8 md:gap-x-8 md:text-left pl-2 pr-2 footer-text">
        {/* Left Column - Logo and Description */}
        <div className="">
        <Link className="hidden flex-shrink-0 lg:block" href="/frontend/">
          <Image
            src="/images/logo/Footer-logo.svg" // Replace with your logo path
            width={400}
            height={50}
            alt="TMSM Logo"
            className="mx-auto md:mx-0"
          />
          </Link>
          <div className="flex justify-center md:justify-start space-x-4 mt-4 items-center">
            <div className="flex justify-center md:justify-start space-x-4">
              <Link href="#">
                <Image
                  src="/images/icon/twitter.svg" // Replace with your social icon paths
                  width={18}
                  height={15}
                  alt="Twitter"
                />
              </Link>
              <Link href="#">
                <Image
                  src="/images/icon/facebook.svg"
                  width={18}
                  height={15}
                  alt="Facebook"
                />
              </Link>
              <Link href="#">
                <Image
                  src="/images/icon/insta.svg"
                  width={18}
                  height={15}
                  alt="Instagram"
                />
              </Link>
            </div>
            <div className="">
              <p className="footer-p">
                &copy; {new Date().getFullYear()} TMSMMatrimony.com. All rights reserved.
              </p>
            </div>
          </div>

        </div>

        {/* Middle Column - Links */}
        <div>
          <ul className="space-y-4">
            <li >
              <Link href="/frontend" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/frontend/about" className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/frontend/terms" className="hover:text-white">
                Terms and Conditions
              </Link>
            </li>
            <li>
              <Link href="/frontend/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Column - Links */}
        <div>
          <ul className="space-y-4">
            <li>
              <Link href="/frontend/faq" className="text-gray-400 hover:text-white">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/frontend/guidelines" className="text-gray-400 hover:text-white">
                General Guidelines
              </Link>
            </li>
            <li>
              <Link href="/frontend/sitemap" className="text-gray-400 hover:text-white">
                Sitemap
              </Link>
            </li>
            <li>
              <Link href="/frontend/contact" className="text-gray-400 hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default FooterWithCustomDesign;
