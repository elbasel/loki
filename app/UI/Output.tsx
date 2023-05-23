interface OutputProps {
  children?: React.ReactNode;
  className?: string;
}

export const Output: React.FC<OutputProps> = ({ children, className }) => {
  return <output className={className}>{children}</output>;
};

export default Output;
