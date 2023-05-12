import { AutoAnimate } from "@app/auto-animate";

interface NavbarProps {
  navbarHidden?: boolean;
}
export const Navbar: React.FC<NavbarProps> = ({
  navbarHidden = false,
}: NavbarProps) => {
  return (
    <AutoAnimate className="overflow-hidden">
      {!navbarHidden && (
        <nav className="relative flex justify-between">
          <div className={"transition-all"}>
            <h1>Loki</h1>
          </div>
        </nav>
      )}
    </AutoAnimate>
  );
};
export default Navbar;
