"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const navLinks = [
    { label: "About",    href: "#about"    },
    { label: "Timeline", href: "#timeline" },  
    { label: "Vision",   href: "#vision"   },
    { label: "FAQ",      href: "#faq"      },
  ];

  return (
    <>
      <nav
        className={`w-full sticky top-0 z-50 px-6 py-4 transition-all duration-300 ${
          scrolled ? "border-b border-white/10 backdrop-blur-md bg-black/20" : "border-b border-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto flex w-full justify-between items-center">
          <Link href="/" className="shrink-0 relative z-50">
            <Image src="/logo2.png" alt="Brilliant Move Logo" height={50} width={50} />
          </Link>
          <div className="hidden md:flex gap-20 font-poppins font-medium uppercase text-sm text-white">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="border-b-2 border-transparent hover:border-accent hover:scale-105 transition-all duration-300 ease-in-out"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="hidden md:block">
            <Link
              href=""
              className="font-poppins font-medium text-black bg-accent px-4 py-2 rounded-xl border-2 border-accent hover:bg-transparent hover:text-white transition-all duration-300 ease-in-out"
            >
              Register →
            </Link>
          </div>
          <button
            onClick={toggleMenu}
            className="md:hidden relative z-50 text-white hover:text-accent p-2 transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </nav>
      <div
        className={`fixed inset-0 z-40 md:hidden flex flex-col justify-center items-center gap-8 transition-all duration-300 ease-in-out bg-[#0d0d0d]
          ${isOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-3"}
        `}
      >
        <div className="flex flex-col items-center gap-8 font-poppins font-medium uppercase text-2xl text-white">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={toggleMenu}
              className="hover:text-accent transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </div>

        <Link
          href=""
          onClick={toggleMenu}
          className="mt-4 font-poppins font-medium text-black bg-accent px-8 py-3 rounded-xl border-2 border-accent hover:bg-transparent hover:text-white transition-all duration-300 text-lg"
        >
          Register →
        </Link>
      </div>
    </>
  );
}