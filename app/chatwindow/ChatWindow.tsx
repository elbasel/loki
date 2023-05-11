import { AutoAnimate } from "@app/autoanimate";
import { Loader } from "@app/loader";
import React, { useState } from "react";
import { ChatMessage, type ChatMessageProps } from "./ChatMessage";
import { twMerge } from "tailwind-merge";

interface ChatWindowProps {
  onSubmit: (formData: FormData) => void;
  loading: boolean;
  messages: ChatMessageProps[];
  inputName: string;
}
export const ChatWindow: React.FC<ChatWindowProps> = ({
  onSubmit,
  loading,
  messages,
  inputName,
}) => {
  const [userPrompt, setUserPrompt] = useState("");
  console.log({ messages });

  return (
    <form className="flex flex-col-reverse flex-1 px-4" action={onSubmit}>
      <div className="relative mt-6">
        <label hidden={true} htmlFor="prompt">
          Prompt
        </label>
        <input
          required
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Enter your prompt here"
          className="text-input"
          type="text"
          id="prompt"
          name={inputName}
        />
        <button
          disabled={loading}
          className="absolute top-0 right-0 flex items-center justify-center min-h-full w-fit btn"
          type="submit"
        >
          {loading ? <Loader /> : "Submit"}
        </button>
      </div>
      <output
        className="flex flex-wrap items-center overflow-hidden transition-all"
        name={inputName}
      >
        {/* <span className="shrink-0">Your current Open Ai API Key: </span> */}
        <AutoAnimate className="flex flex-col-reverse gap-2">
          {/* a chat message component */}
          {messages.map(({ message, author, id }) => (
            <React.Fragment key={id}>
              <ChatMessage
                message={message}
                className={twMerge(author === "human" && "flex-row-reverse")}
              />
            </React.Fragment>
          ))}
        </AutoAnimate>
      </output>
    </form>
  );
};
export default ChatWindow;
