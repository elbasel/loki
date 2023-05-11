import { twMerge } from "tailwind-merge";

export interface ChatMessageProps {
  id?: number;
  message: string;
  author?: "human" | "ai";
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  className,
}) => {
  if (!message) return null;
  return (
    <div className={twMerge("flex", className)}>
      <p
        className={
          "ChatMessage w-fit max-w-[53vw] border-white border rounded-lg py-2 px-4 transition-all duration-700"
        }
      >
        {message}
      </p>
    </div>
  );
};
