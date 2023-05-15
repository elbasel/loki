import React, { useRef, ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";

interface TextAreaProps {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  name,
  className,
  required,
  disabled,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    resizeInput();
    if (onChange) onChange(event.target.value.trim());
  };

  const resizeInput = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      let height = inputRef.current.scrollHeight;
      inputRef.current.style.height = height + "px";
    }
  };

  return (
    <textarea
      disabled={disabled}
      required={required}
      ref={inputRef}
      className={twMerge(
        "w-full text-white bg-black py-2 px-4 rounded-lg resize-none app-scrollbar focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200",
        className
      )}
      placeholder={disabled ? "Loading..." : "Type your message here..."}
      onChange={handleInputChange}
      rows={1}
      value={value}
      name={name}
    />
  );
};
