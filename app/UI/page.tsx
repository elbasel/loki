"use client";

import { useEffect, useRef } from "react";


interface TestRefProps {}

export const TestRef: React.FC<TestRefProps> = ({}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
    </>
  );
};

export default TestRef;
