import { useAutoAnimate } from "@formkit/auto-animate/react";

interface AutoAnimateProps {
  children?: React.ReactNode;
  config?: any;
  className?: string;
}
export const AutoAnimate: React.FC<AutoAnimateProps> = ({
  children,
  config,
  className,
}) => {
  const [parent, enableAnimations] = useAutoAnimate(config);

  return (
    <div className={className} ref={parent}>
      {children}
    </div>
  );
};
export default AutoAnimate;
