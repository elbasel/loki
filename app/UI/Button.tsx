"use client";

import { twMerge } from "tailwind-merge";
import { buttonClassName as defaultButtonClassName } from "./defaultClassNames";
import { Loader } from ".";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  formAction?: (FormData: FormData) => void;
  type?: "submit" | "reset" | "button";
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  type = "button",
  className,
  children,
  disabled,
  formAction,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick && onClick}
      className={twMerge(defaultButtonClassName, className)}
      type={type}
      formAction={formAction && formAction}
    >
      {disabled ? <Loader /> : children}
    </button>
  );
};
