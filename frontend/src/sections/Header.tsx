"use client"

import { Button, ButtonProps } from "@/components/Button"
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import { Orbit } from "@/components/Orbit"

export const navItems = [
  {
    name: "Features",
    href: "#features",
  },
  {
    name: "How it Works",
    href: "#how-it-works",
  },
  {
    name: "Contact",
    href: "#contact",
  },
];

export const loginItems = [
  {
    buttonVariant: "secondary",
    name: "Login",
    href: "#login",
  },
  {
    buttonVariant: "primary",
    name: "Sign Up",
    href: "#sign-up",
  },
] satisfies {
  name: string;
  buttonVariant: ButtonProps["variant"];
  href: string;
}[];

export const Header = () => {
  const [isMoblieMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <>
      <header className="border-b border-gray-200/20 z-[60] sticky bg-background dark:bg-gray-950 shadow-sm top-0">
        <div className="container">
          <div className="h-18 lg:h-20 flex justify-between items-center">
            {/* Left Content */}
            <div className="flex items-center">
              {/* Logo */}
              <div>
                <img loading="lazy" src="/white_logo.png" alt="Logo" className="hidden dark:block" />
              </div>
              <div>
                <img loading="lazy" src="/black_logo.png" alt="Logo" className="block dark:hidden" />
              </div>
            </div>
            {/* Middle Content */}
            <div className="h-full hidden lg:block">
              <nav className="h-full">
                {navItems.map(({ name, href }) => (
                  <a href={href} key={href} className="h-full px-10 relative font-bold text-xs tracking-widest text-gray-950 dark:text-gray-400 uppercase inline-flex items-center">{name}</a>
                ))}
              </nav>
            </div>
            {/* Desktop Right Buttons */}
            <div className="hidden lg:flex gap-4">
              {loginItems.map(({ buttonVariant, name, href }) => (
                <a href={href} key={name}>
                  <Button variant={buttonVariant}>{name}</Button>
                </a>

              ))}

            </div>
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button className="size-10 relative rounded-lg border-2 border-primary" onClick={() => setIsMobileMenuOpen((curr) => !curr)}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className={twMerge("w-4 h-0.5 bg-gray-950 dark:bg-gray-100 -translate-y-1 duration-300", isMoblieMenuOpen && "translate-y-0 rotate-45")}></div>

                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className={twMerge("w-4 h-0.5 bg-gray-950 dark:bg-gray-100 translate-y-1 duration-300", isMoblieMenuOpen && "translate-y-0 -rotate-45")}>

                  </div>

                </div>

              </button>
            </div>
          </div>

        </div>
      </header>
      {/* Mobile Menu */}
      {isMoblieMenuOpen && (
        <div className="fixed top-18 left-0 bottom-0 right-0 bg-background dark:bg-gray-950 z-30 overflow-hidden">
          <div className="absolute-center isolate -z-10">
            <Orbit />
          </div>
          <div className="absolute-center isolate -z-10">
            <Orbit className="size-[350px]" />
          </div>
          <div className="absolute-center isolate -z-10">
            <Orbit className="size-[500px]" />
          </div>
          <div className="absolute-center isolate -z-10">
            <Orbit className="size-[650px]" />
          </div>
          <div className="absolute-center isolate -z-10">
            <Orbit className="size-[800px]" />
          </div>
          <div className="container h-full">
            <nav className="flex flex-col gap-4 items-center py-8 h-full justify-center">
              {navItems.map(({ name, href }) => (
                <a href={href} key={href} className="text-gray-950dark:text-gray-400 uppercase tracking-widest font-bold text-xs h-10">{name}</a>
              ))}

              {loginItems.map(({ buttonVariant, name, href }) => (
                <a href={href} key={name} className="w-full max-w-xs">
                  <Button block variant={buttonVariant}>{name}</Button>
                </a>

              ))}
            </nav>
          </div>

        </div>

      )}

    </>
  )
};

export default Header;
