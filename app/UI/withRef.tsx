import { forwardRef } from "react";

// ! WrappedComponent should have a prop called "forwardedRef"
export const withRef = <T extends object>(WrappedComponent: React.FC<T>) => {
  const WrapperComponentWithRef = (props: T, ref: React.Ref<any>) => {
    return <WrappedComponent {...props} forwardedRef={ref} />;
  };

  WrapperComponentWithRef.displayName = `withRef(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return forwardRef(WrapperComponentWithRef);
};
