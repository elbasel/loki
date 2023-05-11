"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { Navbar } from "./navbar";
import { twMerge } from "tailwind-merge";
import { MenuIcon } from "./icons";
import { useEffect, useState } from "react";
import { Sidebar } from "./navbar/sidebar";

interface ViewableArea {
  width: number;
  height: number;
}

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarHidden, setSidebarHidden] = useState(true);
  const [navbarHidden, setNavbarHidden] = useState(false);
  const [viewportSize, setViewableArea] = useState<ViewableArea>();

  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setViewableArea({ width, height });
  };

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
    window.addEventListener("resize", handleResize);
    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("scroll", handleScroll);

    setTimeout(() => {
      setNavbarHidden(true);
    }, 3000);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  return (
    <html lang="en" className="text-white bg-slate-900">
      <body
        style={viewportSize}
        className={twMerge(
          inter.className,
          "px-4 h-[100dvh] overflow-hidden flex flex-col py-2"
        )}
      >
        <Navbar navbarHidden={navbarHidden} />
        <Sidebar className="z-10" hidden={sidebarHidden} />
        {children}
      </body>
    </html>
  );
}
