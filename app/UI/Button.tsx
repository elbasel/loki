"use client";

import { twMerge } from "tailwind-merge";
import { buttonClassName as defaultButtonClassName } from "./defaultClassNames";
import { Loader } from "@app/loader";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  type = "button",
  className,
  children,
  disabled,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick && onClick}
      className={twMerge(defaultButtonClassName, className)}
      type={type}
    >
      {disabled ? <Loader /> : children}
    </button>
  );
};
