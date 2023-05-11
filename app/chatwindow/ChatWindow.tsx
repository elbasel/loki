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
      <output
        className="flex mt-6 max-h-[86vh] overflow-hidden transition-all"
        name={"user-prompt"}
      >
        {/* <span className="shrink-0">Your current Open Ai API Key: </span> */}
        <AutoAnimate className="flex flex-col-reverse gap-2 pt-2 overflow-y-auto scrollbar-thin ChatWindow-ChatMessages">
          {/* a chat message component */}
          {messages.map(({ message, author, id }) => (
            <Fragment key={id}>
              <ChatMessage
                message={message}
                className={twMerge(author === "human" && "flex-row-reverse")}
              />
            </Fragment>
          ))}
        </AutoAnimate>
      </output>
      <form className="relative flex-1 text-xl" action={handleSubmit}>
        <div className="ChatWindow-InnerFormContainer absolute mt-6 transform -translate-x-full -translate-y-full top-[95%] left-full">
          <label hidden={true} htmlFor="user-prompt">
            Prompt
          </label>
          <input
            required
            placeholder="Enter your prompt here"
            className="text-input"
            type="text"
            id="user-prompt"
            name={"user-prompt"}
          />
          <button
            disabled={loading}
            className="absolute top-0 right-0 flex items-center justify-center min-h-full w-fit btn"
            type="submit"
          >
            {loading ? <Loader /> : <RiSendPlaneLine />}
          </button>
        </div>
      </form>
    </>
  );
};
export default ChatWindow;
