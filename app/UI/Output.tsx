import { twMerge } from "tailwind-merge";
import { withRef } from "./withRef";

interface OutputProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

export const Output: React.FC<OutputProps> = ({ children, className, id }) => {
  return (
    <output
      id={id}
      className={twMerge(
        "max-h-[85vh] pr-2 block overflow-y-auto overflow-x-hidden app-scrollbar scrollbar",
        className
      )}
    >
      {children}
    </output>
  );
};

export const OutputWithRef = withRef(Output);
