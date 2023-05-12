"use client";

import React, { useRef, ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";

interface TextAreaProps {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  name,
  className
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    resizeInput();
    if (onChange) onChange(event.target.value);
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
      ref={inputRef}
      className={twMerge("w-full text-white bg-black rounded-lg resize-none app-scrollbar focus:outline-none", className)}
      placeholder="Type something..."
      onChange={handleInputChange}
      value={value}
      name={name}
    />
  );
};
