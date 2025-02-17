"use client";

import React from "react";
import Link from "next/link";
import "@/css/style.css";
import "@/css/frontend.css";
import { usePathname } from "next/navigation";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import GTranslateWidget from '@/components/GTranslateWidget/widget';
import { Navbar, Collapse, IconButton } from "@material-tailwind/react";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

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
  return (
    <ul className="mb-4 mt-2 pl-2 flex flex-col gap-3 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-8 header-text">
      <NavItem label="Home" href="/" />
      <NavItem label="Member" href="/member" />
      <NavItem label="About" href="/about" />
      <NavItem label="Contact" href="/contact" />

      {/* Desktop Navigation */}
      <div className="flex bg-white px-5 py-3 gap-5 rounded-full bg-button hidden lg:block header-text">
        {session && !session.user.is_admin ? (
          <>
            <NavItem label="Dashboard" href="/dashboard" className="pr-5 headertext border-r border-black" />
            <NavItem label="Logout" onClick={() => signOut()} className="pl-5  headertext" />
          </>
        ) : (
          <>
            <NavItem label="Register" href="/register" className="pr-5 headertext border-r border-black headertext" />
            <NavItem label="Login" href="/login" className="pl-5" />
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      {session ? (
        <>
          <NavItem label="Dashboard" href="/dashboard" className="block lg:hidden" />
          <NavItem label="Logout" onClick={() => signOut()} className="block lg:hidden" />
        </>
      ) : (
        <>
          <NavItem label="Register" href="/register" className="block lg:hidden" />
          <NavItem label="Login" href="/login" className="block lg:hidden" />
        </>
      )}

    </ul>
  );
}

export function NavbarWithSimpleLinks() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Navbar
      className="header-bg py-6 border-0"
      fullWidth={true}
      {...({} as any)}
    >

      <div className="container mx-auto flex items-center justify-between mt-6">
        <Link className="hidden flex-shrink-0 lg:block" href="/">
          <img
            className="xl:w-[700px] lg:w-[400px] sm:w-[300px]"
            src={"/images/logo/Flogo.svg"}
            alt="Logo"
            loading="lazy"
          />
        </Link>

        <div className="hidden lg:block">
          <NavList />
        </div>

        <Link className="block flex-shrink-0 lg:hidden" href="/">
          <Image width={280} height={300} src={"/images/logo/Flogo.svg"} alt="Logo" />
        </Link>

        <IconButton
          size="sm"
          title="Click to toggle"
          variant="text"
          color="blue-gray"
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden"
          {...({} as any)}
        >
          {open ? (
            <XMarkIcon className="h-5 w-5" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-5 w-5" strokeWidth={2} />
          )}
        </IconButton>
      </div>

      <Collapse open={open}>
        <div className="mt-2 rounded-xl bg-white py-2">
          <NavList />
        </div>
      </Collapse>
    </Navbar>
  );
}

export default NavbarWithSimpleLinks;