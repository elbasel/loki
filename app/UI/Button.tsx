"use client";

import { twMerge } from "tailwind-merge";
import { buttonClassName as defaultButtonClassName } from "./defaultClassNames";
import { Loader } from "@app/loader";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  className,
  children,
  disabled,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick && onClick}
      className={twMerge(defaultButtonClassName, className)}
    >
      {disabled ? <Loader /> : children}
    </button>
  );
};
