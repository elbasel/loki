import { useEffect, useState } from "react";

export interface ViewportSize {
  width: number | undefined;
  height: number | undefined;
}

export function getViewableArea(): ViewportSize | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const documentWidth = document.documentElement.clientWidth;
  const documentHeight = document.documentElement.clientHeight;
  const width = Math.min(viewportWidth, documentWidth);
  const height = Math.min(viewportHeight, documentHeight);
  return { width, height };
}

export const useViewportSize = (): ViewportSize | undefined => {
  const [viewableArea, setViewableArea] = useState<ViewportSize | undefined>(
    undefined
  );

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          const { inlineSize, blockSize } = entry.contentBoxSize[0];
          setViewableArea({ width: inlineSize, height: blockSize });
        } else {
          setViewableArea(getViewableArea());
        }
      }
    });

    resizeObserver.observe(document.documentElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return viewableArea;
};
