"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { Navbar } from "./navbar";
import { twMerge } from "tailwind-merge";
import { MenuIcon } from "./icons";
import { useEffect, useState } from "react";
import { Sidebar } from "./navbar/sidebar";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Chat",
//   description: "Chat",
// };

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
    };
  }, []);

  return (
    <html lang="en" className="text-white bg-slate-900">
      <body
        className={twMerge(
          inter.className,
          "pl-4 py-2 pr-20 min-h-screen !min-h-[100dvh] flex flex-col"
        )}
      >
        <Navbar navbarHidden={navbarHidden} />
        <MenuIcon
          active={!sidebarHidden}
          onClick={() => setSidebarHidden((prev) => !prev)}
          className="fixed z-20 -mt-4 -ml-4 transform -translate-x-full -translate-y-full w-fit left-full top-full"
        />
        <Sidebar className="z-10" hidden={sidebarHidden} />
        {children}
      </body>
    </html>
  );
}
