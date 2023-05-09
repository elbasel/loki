"use client";

import MenuIcon from "@app/icons/MenuIcon";
import { Sidebar } from "@app/navbar/sidebar";
import { useEffect, useState } from "react";

interface NavbarProps {}
export const Navbar: React.FC<NavbarProps> = () => {
  const [sidebarHidden, setSidebarHidden] = useState(true);

  const handleEscapePress = (e: KeyboardEvent) => {
    console.log({ e });
    if (e.key === "Escape" && !sidebarHidden) {
      return setSidebarHidden(true);
    }

    if (e.key === "u" && e.altKey) {
      return setSidebarHidden((prev) => !prev);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscapePress);

    return () => {
      document.removeEventListener("keypress", handleEscapePress);
    };
  }, []);

  return (
    <>
      <Sidebar className="z-10" hidden={sidebarHidden} />
      <nav className="relative z-50 flex justify-between px-4 py-2">
        <div className={"transition-all " + (!sidebarHidden && "opacity-0")}>
          <h1>Loki</h1>
        </div>
        <MenuIcon
          active={!sidebarHidden}
          onClick={() => setSidebarHidden((prev) => !prev)}
          className="fixed -mt-2 -ml-2 transform -translate-x-full -translate-y-full w-fit left-full top-full"
        />
      </nav>
    </>
  );
};
export default Navbar;
