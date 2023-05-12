"use client";
import { useState } from "react";
import { TextArea } from "./TextArea";

const TextAreaTest = () => {
  const [value, setValue] = useState("");
  return (
    <>
      <h1>Test the text area</h1>
      <div className="px-4 py-2 bg-black rounded-lg">
        <TextArea className="max-h-[70svh]" value={value} onChange={(newValue) => setValue(newValue)} />
      </div>
    </>
  );
};

export default TextAreaTest;
