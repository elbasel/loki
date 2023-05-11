"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { Navbar } from "./navbar";
import { twMerge } from "tailwind-merge";
import { MenuIcon } from "./icons";
import { useEffect, useState } from "react";
import { Sidebar } from "./navbar/sidebar";
import { useWindowSize } from "usehooks-ts";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarHidden, setSidebarHidden] = useState(true);
  const [navbarHidden, setNavbarHidden] = useState(false);
  const { width, height } = useWindowSize();

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
    };
  }, []);

  return (
    <html lang="en" className="text-white bg-slate-900">
      <body
        style={{ height, width }}
        className={twMerge(
          inter.className,
          "px-4 overflow-hidden flex flex-col py-2"
        )}
      >
        <Navbar navbarHidden={navbarHidden} />
        <MenuIcon
          active={!sidebarHidden}
          onClick={() => setSidebarHidden((prev) => !prev)}
          className="fixed inset-0 z-20 flex flex-row-reverse w-screen px-4 py-2 h-fit"
        />
        <Sidebar className="z-10" hidden={sidebarHidden} />
        {children}
      </body>
    </html>
  );
}
