import { forwardRef } from "react";

interface ButtonProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({}, ref) => {
  return <button ref={ref}>
    button
  </button>;
})

Button.displayName = "Button";

export default Button;
