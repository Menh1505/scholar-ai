"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Navbar() {
  const [isTop, setIsTop] = useState(true);
  const [isWideScreen, setIsWideScreen] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY < 10);
      setIsWideScreen(window.innerWidth > 820);
    };
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollVariant = !isWideScreen || isTop ? "top" : "scrolled";

  return (
    <motion.nav
      initial={false}
      animate={scrollVariant}
      variants={{
        top: {
          width: "100%",
          height: "80px",
          backgroundColor: "",
          boxShadow: "0 0 0 rgba(0,0,0,0)",
          borderRadius: "0px",
          x: 0,
          translateX: "-0%",
        },
        scrolled: {
          width: "60%",
          height: "56px",
          backgroundColor: "",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          borderRadius: "12px",
          y: "10%",
          x: "0%",
          left: "50%",
          translateX: "-50%",
        },
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-0 left-0 z-50 px-2 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full">
        <Link href="/">
          <Image src="/icons/full-logo.svg" alt="logo" width={198} height={96} />
        </Link>
        <div className="space-x-4">
          <a href="#" className="text-sm hover:underline">
            Home
          </a>
          <a href="#" className="text-sm hover:underline">
            Features
          </a>
          <a href="#" className="text-sm hover:underline">
            Contact
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
