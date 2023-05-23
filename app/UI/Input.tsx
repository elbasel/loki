"use client";

import { twMerge } from "tailwind-merge";
import { withRef } from "./withRef";
import { inputClassName as defaultInputClassName } from "./defaultClassNames";

interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  id?: string;
  disabled?: boolean;
  forwardedRef?: React.Ref<HTMLInputElement>;
}

export const Input: React.FC<InputProps> = (props) => {
  const {
    value,
    onChange,
    name,
    className,
    required,
    placeholder,
    forwardedRef,
    id,
    disabled,
  } = props;

  return (
    <input
      required={required}
      ref={forwardedRef && forwardedRef}
      className={twMerge(defaultInputClassName, className)}
      placeholder={placeholder || "Type something..."}
      onChange={(e) => onChange && onChange(e.target.value)}
      value={value}
      name={name}
      id={id}
      disabled={disabled}
    />
  );
};

export const InputWithRef = withRef(Input);
