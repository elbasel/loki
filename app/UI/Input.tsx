"use client";

import { withRef } from "./withRef";

interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
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
  } = props;

  return (
    <input
      required={required}
      ref={forwardedRef && forwardedRef}
      className={className}
      placeholder={placeholder || "Type something..."}
      onChange={(e) => onChange && onChange(e.target.value)}
      value={value}
      name={name}
    />
  );
};

export const InputWithRef = withRef(Input);
