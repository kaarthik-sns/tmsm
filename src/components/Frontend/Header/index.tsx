'use client';

import React from "react";
import Link from "next/link";
import "@/css/style.css";
import "@/css/frontend.css";

import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

import {
  Navbar,
  Collapse,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

interface NavItemPropsType {
  label: string;
  href?: string;
  className?: string;
  onClick?: () => void;
}

function NavItem({ label, href, className, onClick }: NavItemPropsType) {
  return href ? (
    <Link href={href} className={className}>
      {label}
    </Link>
  ) : (
    <button onClick={onClick} className={className}>
      {label}
    </button>
  );
}

function NavList() {
  const { data: session } = useSession(); // Get session data

  return (
<ul className="mb-4 mt-2 pl-2 flex flex-col gap-3 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-8 header-text">
  <NavItem label="Home" href="/frontend" />
  <NavItem label="About" href="/about" />
  <NavItem label="Contact" href="/contact" />

  {/* Desktop Navigation */}
  <div className="flex bg-white px-5 py-3 gap-5 rounded-full bg-button hidden lg:block header-text">
    {session ? (
      <>
        {/* <NavItem label="Logout" onClick={() => signOut()} className="pr-5 border-r border-black headertext" />
        <NavItem label="Dashboard" href="/frontend/dashboard" className="pr-5 headertext" /> */}
        <NavItem label="Logout" onClick={() => signOut()} className="pr-5 border-r border-black headertext" />
        <NavItem label="Dashboard" href="/frontend/dashboard" className="pl-5 headertext" />
      </>
    ) : (
      <>
        <NavItem label="Login" href="/frontend/login" className="pr-5 border-r border-black headertext" />
        <NavItem label="Register" href="/frontend/register" className="pl-5 headertext" />
      </>
    )}
  </div>

  {/* Mobile Navigation */}
  {session ? (
    <>
      <NavItem label="Logout" onClick={() => signOut()} className="block lg:hidden" />
      <NavItem label="Dashboard" href="/frontend/dashboard" className="block lg:hidden" />
    </>
  ) : (
    <>
      <NavItem label="Login" href="/frontend/login" className="block lg:hidden" />
      <NavItem label="Register" href="/frontend/register" className="block lg:hidden" />
    </>
  )}

  <Image width={30} height={30} src={"/images/logo/globe.svg"} alt="Logo" />
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
    <Navbar className="header-bg py-6 border-0"
      fullWidth={true}
      placeholder="" // If placeholder is required
      onPointerEnterCapture={() => { }}
      onPointerLeaveCapture={() => { }}>
              <div className="container mx-auto flex items-center justify-between mt-6">
        <Link className="hidden flex-shrink-0 lg:block" href="/frontend/">
          <Image
            className="xl:w-[700px] lg:w-[400px] sm:w-[300px]"
            width={700}
            height={400}
            src={"/images/logo/Flogo.svg"}
            alt="Logo"
          />
        </Link>

        <div className="hidden lg:block">
          <NavList />
        </div>

        <Link className="block flex-shrink-0 lg:hidden" href="/frontend/">
          <Image width={280} height={300} src={"/images/logo/Flogo.svg"} alt="Logo" />
        </Link>

        <IconButton
          size="sm"
          title="Click to toggle"
          variant="text"
          color="blue-gray"
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden"
        >
          {open ? <XMarkIcon className="h-5 w-5" strokeWidth={2} /> : <Bars3Icon className="h-5 w-5" strokeWidth={2} />}
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
