import { useState, ChangeEvent, CSSProperties } from 'react';

interface TextInputProps {
  onChange: (value: string) => void;
  placeholder?: string;
  value?: string;
  className?: string;
}

const TextInput = ({
  onChange,
  placeholder = '',
  value = '',
  className = '',
}: TextInputProps) => {
  const [height, setHeight] = useState<number | 'auto'>('auto');

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
    setHeight(event.target.scrollHeight);
  };

  const textareaStyles: CSSProperties = {
    height: height === 'auto' ? 'auto' : `${height}px`,
    minHeight: '3rem',
    maxHeight: '12rem',
  };

  return (
    <textarea
      className={`resize-none border border-gray-400 rounded-md py-2 px-3 leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      style={textareaStyles}
    />
  );
};

export default TextInput;
