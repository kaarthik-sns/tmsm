'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export function FooterWithCustomDesign() {

  const [copyright, setCopyright] = useState('TMSMMatrimony.com. All rights reserved.');
  const [settings, setSettings] = useState<Record<string, any>>({});


  useEffect(() => {

    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/get-settings-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const { data } = await response.json();

        setCopyright(data.copyright);
        setSettings(data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchSettings();

  }, []);

  return (
    <footer className="dark-bg text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-[50%_30%_20%] gap-y-8 md:gap-x-8 md:text-left pl-2 pr-2 footer-text">

        {/* Left Column - Logo and Description */}
        <div className="flex flex-col items-center md:items-start">
          <Link className="flex-shrink-0 lg:block" href="/">
            <img
              alt="TMSM Logo"
              loading="lazy"
              width="400"
              height="50"
              className="mx-auto md:mx-0"
              src="/images/logo/Footer-logo.svg" />
          </Link>
          <div className="flex justify-center md:justify-start space-x-4 mt-4 items-center  md:block  hidden">
            <div className="flex justify-center md:justify-start space-x-4">
              <Link href={settings?.twitter ? settings.twitter : "#"}>
                <Image
                  src="/images/icon/twitter.svg" // Replace with your social icon paths
                  width={18}
                  height={15}
                  alt="Twitter"
                  loading="lazy"
                />
              </Link>
              <Link href={settings?.facebook ? settings.facebook : "#"}>
                <Image
                  src="/images/icon/facebook.svg"
                  width={18}
                  height={15}
                  alt="Facebook"
                  loading="lazy"
                />
              </Link>
              <Link href={settings?.instagram ? settings.instagram : "#"}>
                <Image
                  src="/images/icon/insta.svg"
                  width={18}
                  height={15}
                  alt="Instagram"
                  loading="lazy"
                />
              </Link>
            </div>
          </div>
          <div className="mt-4 text-center md:text-left md:block  hidden">
            <p className="footer-p">
              &copy; {new Date().getFullYear()} {copyright}
            </p>
          </div>
        </div>

        {/* Middle Column - Links */}
        <div className="text-center md:text-left">
          <ul className="space-y-4">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                Terms and Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Column - Links */}
        <div className="text-center md:text-left">
          <ul className="space-y-4">
            <li>
              <Link href="/faq" className="text-gray-400 hover:text-white">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-400 hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom - Social Icons and Copyright */}
      <div className="flex flex-col items-center md:items-start justify-center mt-8 md:mt-0 md:hidden block">
        <div className="flex space-x-4 mb-4">
          <Link href={settings?.twitter ? settings.twitter : "#"}>
            <Image
              src="/images/icon/twitter.svg"
              width={18}
              height={15}
              alt="Twitter"
              loading="lazy"
            />
          </Link>
          <Link href={settings?.facebook ? settings.facebook : "#"}>
            <Image
              src="/images/icon/facebook.svg"
              width={18}
              height={15}
              alt="Facebook"
              loading="lazy"
            />
          </Link>
          <Link href={settings?.instagram ? settings.instagram : "#"}>
            <Image
              src="/images/icon/insta.svg"
              width={18}
              height={15}
              alt="Instagram"
              loading="lazy"
            />
          </Link>
        </div>
        <div className="text-center">
          <p className="footer-p">
            &copy; {new Date().getFullYear()} {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default FooterWithCustomDesign;
