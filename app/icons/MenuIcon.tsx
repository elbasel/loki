import { twMerge } from "tailwind-merge";

interface MenuIconProps {
  className?: string;
  onClick?: () => void;
  active?: boolean;
}
export const MenuIcon: React.FC<MenuIconProps> = ({
  className,
  onClick,
  active,
}) => {
  return (
    <div className={className}>
      <button
        onClick={onClick}
        className={twMerge("relative group rounded-3xl")}
      >
        <div
          className={twMerge(
            "relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all bg-slate-700 ring-0 ring-gray-300 hover:ring-8 ring-opacity-30 duration-200 shadow-md",
            active && "ring-4"
          )}
        >
          <div
            className={twMerge(
              "flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden"
            )}
          >
            <div
              className={twMerge(
                "bg-white h-[2px] w-7 transform transition-all duration-300 origin-left delay-100",
                active && "translate-y-6"
              )}
            ></div>
            <div
              className={twMerge(
                "bg-white h-[2px] w-7 rounded transform transition-all duration-300 delay-75",
                active && "translate-y-6"
              )}
            ></div>
            <div
              className={twMerge(
                "bg-white h-[2px] w-7 transform transition-all duration-300 origin-left",
                active && "translate-y-6"
              )}
            ></div>

            <div
              className={twMerge(
                "absolute items-center justify-between flex w-0 transform transition-all duration-500 top-2.5 -translate-x-10",
                active && "translate-x-0 w-12"
              )}
            >
              <div
                className={twMerge(
                  "absolute bg-white h-[2px] w-5 transform transition-all duration-500 rotate-0 delay-300",
                  active && "rotate-45"
                )}
              ></div>
              <div
                className={twMerge(
                  "absolute bg-white h-[2px] w-5 transform transition-all duration-500 -rotate-0 delay-300",
                  active && "-rotate-45"
                )}
              ></div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};
export default MenuIcon;
