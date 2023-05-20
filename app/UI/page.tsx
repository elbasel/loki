"use client";

import { useEffect, useRef, useState } from "react";
import { InputWithRef } from "./Input";

interface TestRefProps {}

const TestRef: React.FC<TestRefProps> = ({}) => {
  // test whether InputWithRef will accept a ref
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // when inputRef.current.value changes, update inputValue state
  useEffect(() => {
    if (!inputRef.current) return;
    setInputValue(inputRef.current.value);
  }, [inputRef.current?.value]);

  return (
    <>
      <InputWithRef ref={inputRef} />
      <output>{inputValue}</output>
    </>
  );
};

export default TestRef;
