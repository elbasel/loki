import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const TextArea: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  const [height, setHeight] = useState<number>(0);
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.scrollHeight);
    }
  }, [value]);
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };
  return (
    <textarea
      ref={ref}
      className={twMerge(
        "px-4 py-2 border rounded-lg resize-none focus:outline-none",
        "focus:border-blue-500",
        className
      )}
      style={{ height }}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
    />
  );
};
export default TextArea;
