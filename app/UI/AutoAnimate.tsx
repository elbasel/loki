import { useAutoAnimate } from "@formkit/auto-animate/react";

interface AutoAnimateProps {
  children?: React.ReactNode;
  config?: any;
  className?: string;
  hidden?: boolean;
}
export const AutoAnimate: React.FC<AutoAnimateProps> = ({
  children,
  config,
  className,
  hidden,
}) => {
  const [parent, enableAnimations] = useAutoAnimate(config);

  return (
    <div hidden={hidden} className={className} ref={parent}>
      {children}
    </div>
  );
};
