import { twMerge } from "tailwind-merge";

interface SidebarProps {
  children?: React.ReactNode;
  hidden?: boolean;
  className?: string;
}
export const Sidebar: React.FC<SidebarProps> = ({
  children,
  hidden = true,
  className,
}) => {
  return (
    <aside
      className={twMerge(
        "bg-black opacity-100 fixed inset-0 duration-300 transition-all w-screen text-white transform translate-y-0",
        hidden && "translate-y-full opacity-0",
        className
      )}
    >
      Sidebar
      {children}
    </aside>
  );
};
export default Sidebar;
