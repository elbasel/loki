"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { Navbar } from "./UI/navbar";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { Sidebar } from "./UI/navbar/sidebar";

interface ViewableArea {
  width: number;
  height: number;
}

const inter = Inter({ subsets: ["latin"] });

export const fetchCache = "force-no-store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarHidden, setSidebarHidden] = useState(true);
  const [navbarHidden, setNavbarHidden] = useState(false);

  const handleKeyPress = (e: KeyboardEvent) => {
    // close the sidebar using 'esc'
    if (e.key.toLowerCase() === "escape") {
      return setSidebarHidden(true);
    }

    // toggle the sidebar using a keyboard shortcut
    if (e.key.toLowerCase() === "u" && e.altKey) {
      return setSidebarHidden((prev) => !prev);
    }
  };

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setNavbarHidden(true);
    } else {
      setNavbarHidden(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("scroll", handleScroll);

    setTimeout(() => {
      setNavbarHidden(true);
    }, 3000);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <html lang="en" className="text-white bg-slate-900">
      <body
        className={twMerge(
          inter.className,
          "px-4 h-[100dvh] !h-[100svh] overflow-hidden flex flex-col py-2"
        )}
      >
        <Navbar navbarHidden={navbarHidden} />
        <Sidebar className="z-10" hidden={sidebarHidden} />
        {children}
      </body>
    </html>
  );
}
