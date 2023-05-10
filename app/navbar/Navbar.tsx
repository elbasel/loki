"use client";

import MenuIcon from "@app/icons/MenuIcon";
import { Sidebar } from "@app/navbar/sidebar";
import { useEffect, useState } from "react";

interface NavbarProps {}
export const Navbar: React.FC<NavbarProps> = () => {
  const [sidebarHidden, setSidebarHidden] = useState(true);

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

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  return (
    <>
      <Sidebar className="z-10" hidden={sidebarHidden} />
      <nav className="relative z-50 flex justify-between">
        <div className={"transition-all " + (!sidebarHidden && "opacity-0")}>
          <h1>Loki</h1>
        </div>
        <MenuIcon
          active={!sidebarHidden}
          onClick={() => setSidebarHidden((prev) => !prev)}
          className="fixed -mt-4 -ml-4 transform -translate-x-full -translate-y-full w-fit left-full top-full"
        />
      </nav>
    </>
  );
};
export default Navbar;
