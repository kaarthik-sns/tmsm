"use client";

import React from "react";
import Link from "next/link";
import "@/css/style.css";
import "@/css/frontend.css";
import { usePathname } from "next/navigation";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";


import { Menu, X } from "lucide-react";

interface NavItemPropsType {
  label: string;
  href?: string;
  className?: string;
  onClick?: () => void;
}

function NavItem({ label, href, className, onClick }: NavItemPropsType) {
  const pathname = usePathname();
  const isActive = href === pathname;

  return href ? (
    <Link
      href={href}
      className={`${className} ${isActive ? "active-menu" : ""}`}
    >
      {label}
    </Link>
  ) : (
    <button onClick={onClick} className={className}>
      {label}
    </button>
  );
}


function NavList() {

  const { data: session } = useSession();
  const lang = localStorage.getItem('lang') || 'en';

  return (
    <ul className="mb-4 mt-2 pl-2 flex flex-col gap-3 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-8 header-text">

      {lang === 'en' && (<NavItem label='Home' href="/" />)}
      <NavItem label={lang === 'ta' ? 'உறுப்பினர்கள்' : 'Members'} href="/member" />
      <NavItem label={lang === 'ta' ? 'எங்களை பற்றி' : 'About'} href="/about" />
      <NavItem label={lang === 'ta' ? 'தொடர்புக்கு' : 'Contact'} href="/contact" />

      {/* Desktop Navigation */}
      <div className="flex bg-white px-5 py-3 gap-5 rounded-full bg-button hidden lg:block header-text">
        {session && !session.user.is_admin ? (
          <>
            <NavItem label={lang === 'ta' ? 'எனது பக்கம்' : 'Dashboard'} href="/dashboard" className="pr-5 headertext border-r border-black" />
            <NavItem label={lang === 'ta' ? 'வெளியேறு' : 'Logout'} onClick={() => signOut({ callbackUrl: '/login' })} className="pl-5  headertext" />
          </>
        ) : (
          <>
            <NavItem label={lang === 'ta' ? 'பதிவு செய்' : 'Register'} href="/register" className="pr-5 headertext border-r border-black headertext" />
            <NavItem label={lang === 'ta' ? 'உள்நுழை' : 'Login'} href="/login" className="pl-5" />
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      {session && !session.user.is_admin ? (
        <>
          <NavItem label={lang === 'ta' ? 'எனது பக்கம்' : 'Dashboard'} href="/dashboard" className="block lg:hidden" />
          <NavItem label={lang === 'ta' ? 'வெளியேறு' : 'Logout'} onClick={() => signOut({ callbackUrl: '/login' })} className="block lg:hidden" />
        </>
      ) : (
        <>
          <NavItem label={lang === 'ta' ? 'பதிவு செய்' : 'Register'} href="/register" className="block lg:hidden" />
          <NavItem label={lang === 'ta' ? 'உள்நுழை' : 'Login'} href="/login" className="block lg:hidden" />
        </>
      )}

    </ul>
  );
}

export function NavbarWithSimpleLinks() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const lang = localStorage.getItem('lang') || 'en';

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="header-bg lg:py-2 py-6 border-0 w-full">

      <div className={`${lang == 'ta' ? 'container-header' : 'container'} mx-auto flex items-center justify-between mt-6`}>
        <Link className="hidden lg:block flex-shrink-0" href="/">
          <img
            className="2xl:w-[550px] xl:w-[480px] lg:w-[350px] sm:w-[250px]"
            src={"/images/logo/tmsm-logo.svg"}
            alt="Logo"
            loading="lazy"
          />
        </Link>

        <div className="hidden lg:block">
          <img
            className=""
            src={"/images/logo/Founder.png"}
            alt="Logo"
            loading="lazy"
          />
        </div>

        <div className="hidden lg:block">
          <NavList />
        </div>

        <Link className="block flex-shrink-0 lg:hidden" href="/">
          <Image width={280} height={300} src={"/images/logo/Flogo.svg"} alt="Logo" />
        </Link>

        <button
          title="Click to toggle"
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden text-blue-gray-500 hover:text-blue-gray-700 focus:outline-none"
        >
          {open ? (
            <X className="h-5 w-5" strokeWidth={2} />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={2} />
          )}
        </button>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="mt-2 rounded-xl bg-white py-2">
          <NavList />
        </div>
      </div>
    </nav>
  );
}

export default NavbarWithSimpleLinks;