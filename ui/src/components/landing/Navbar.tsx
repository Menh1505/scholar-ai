"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { FaChevronDown, FaTiktok, FaYoutube, FaFacebook, FaEnvelope, FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export function Navbar() {
  const [isTop, setIsTop] = useState(true);
  const [isWideScreen, setIsWideScreen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY < 10);
      setIsWideScreen(window.innerWidth > 820);
    };
    handleScroll();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollVariant = !isWideScreen || isTop ? "top" : "scrolled";

  return (
    <motion.nav
      initial={false}
      animate={scrollVariant}
      variants={{
        top: {
          width: "80%",
          height: "80px",
          backgroundColor: "",
          borderRadius: "0px",
          x: 0,
          left: "50%",
          translateX: "-50%",
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
        <div className="space-x-10 flex items-center justify-between">
          <Button variant="default" className="text-xl font-semibold text-black">
            <Link href="/">Trang chủ</Link>
          </Button>
          <Button variant="default" className="text-xl font-semibold text-black">
            <Link href="/features">Tính năng</Link>
          </Button>
          <DropdownMenu ref={dropdownRef}>
            <DropdownMenuTrigger
              className="text-xl font-semibold text-black inline-flex items-center justify-center hover:cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              Cộng đồng
              <FaChevronDown className="ml-2 w-4 h-4" />
            </DropdownMenuTrigger>
            {isDropdownOpen && (
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuItem href="https://x.com/ScholarAi14478" target="_blank" rel="noopener noreferrer">
                  <FaXTwitter className="mr-2 w-4 h-4" />X (Twitter)
                </DropdownMenuItem>
                <DropdownMenuItem href="https://www.tiktok.com/@scholarai_official" target="_blank" rel="noopener noreferrer">
                  <FaTiktok className="mr-2 w-4 h-4" />
                  TikTok
                </DropdownMenuItem>
                <DropdownMenuItem href="https://www.youtube.com/@scholarai_official" target="_blank" rel="noopener noreferrer">
                  <FaYoutube className="mr-2 w-4 h-4" />
                  YouTube
                </DropdownMenuItem>
                <DropdownMenuItem href="https://www.facebook.com/groups/scholarai/" target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="mr-2 w-4 h-4" />
                  Facebook
                </DropdownMenuItem>
                <DropdownMenuItem href="https://discord.gg/dj8mfu3m" target="_blank" rel="noopener noreferrer">
                  <FaDiscord className="mr-2 w-4 h-4" />
                  Discord
                </DropdownMenuItem>
                <DropdownMenuItem href="mailto:scholarai.smurf@gmail.com">
                  <FaEnvelope className="mr-2 w-4 h-4" />
                  Gmail
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      </div>
    </motion.nav>
  );
}
