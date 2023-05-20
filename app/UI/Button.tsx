"use client";

import { twMerge } from "tailwind-merge";
import { buttonClassName as defaultButtonClassName } from "./defaultClassNames";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  className,
  children,
}) => {
  return (
    <button
      onClick={onClick && onClick}
      className={twMerge(defaultButtonClassName, className)}
    >
      {children}
    </button>
  );
};
