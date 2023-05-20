export const buttonClassName = [
  // layout
  "flex",
  "items-center",
  "justify-center",
  "w-full",
  "min-h-[38px]",
  // normal
  "bg-blue-500",
  "text-white",
  "active:scale-95",
  "transition",
  "duration-200",
  "font-bold",
  "py-2",
  "px-4",
  "rounded-lg",
  //hover
  "hover:bg-white",
  "hover:text-black",
  // disabled
  "disabled:bg-gray-800",
  "disabled:text-white",
  "disabled:cursor-not-allowed",
].join(" ");

export const inputClassName = [
  // layout
  "block",
  "w-full",
  "min-h-[38px]",
  // normal
  "bg-black",
  "text-white",
  "rounded-lg",
  "py-2",
  "px-4",
  "leading-tight",
  "transition",
  "duration-200",
  // hover
  "hover:border-blue-500/50",
  // focus
  "focus:outline-none",
  "focus:ring",
  "focus:ring-blue-500",
].join(" ");

export const outputClassName = [
  // layout
  "flex-center-1",
].join(" ");
