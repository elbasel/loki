import { AutoAnimate } from "@app/autoanimate";
import { Loader } from "@app/loader";
import { Fragment, useState } from "react";
import { ChatMessage, type ChatMessageProps } from "./ChatMessage";
import { twMerge } from "tailwind-merge";
import { RiSendPlaneLine } from "react-icons/ri";

interface ChatWindowProps {
  onSubmit: (userPrompt: string) => any;
  loading: boolean;
  messages: ChatMessageProps[];
}
export const ChatWindow: React.FC<ChatWindowProps> = ({
  onSubmit,
  loading,
  messages,
}) => {
  const handleSubmit = (formData: FormData) => {
    const userPrompt = formData.get("user-prompt") as string;
    onSubmit(userPrompt);
  };

  return (
    <>
      <output className="mt-auto overflow-y-auto scrollbar-thin">
        <AutoAnimate className="flex flex-col gap-2">
          {messages.map((msg, i) => (
            <Fragment key={i}>
              <ChatMessage
                message={msg.message}
                className={twMerge(msg.author === "user" && "flex-row-reverse")}
              />
            </Fragment>
          ))}
        </AutoAnimate>
      </output>
      <form
        className="flex w-full gap-1 px-4 py-2 mt-4 bg-black rounded-lg"
        action={handleSubmit}
      >
        <input
          type="text"
          name="user-prompt"
          className="flex-1 block bg-black rounded-lg outline-none"
        />
        <button type="submit" className="px-2">
          {loading ? <Loader /> : <RiSendPlaneLine />}
        </button>
      </form>
    </>
  );
};
export default ChatWindow;
