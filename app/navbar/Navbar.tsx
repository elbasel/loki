"use client";

import MenuIcon from "@app/icons/MenuIcon";
import { Sidebar } from "@app/navbar/sidebar";
import { useState } from "react";

interface NavbarProps {}
export const Navbar: React.FC<NavbarProps> = () => {
  const [sidebarHidden, setSidebarHidden] = useState(true);
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
          className="fixed w-fit left-[84%] top-[87%]"
        />
      </nav>
    </>
  );
};
export default Navbar;
