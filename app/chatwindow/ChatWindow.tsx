import { AutoAnimate } from "@app/autoanimate";
import { Loader } from "@app/loader";
import { Fragment, useState } from "react";
import { ChatMessage, type ChatMessageProps } from "./ChatMessage";
import { twMerge } from "tailwind-merge";
import { RiSendPlaneLine } from "react-icons/ri";

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
    <form className="relative flex-1" action={onSubmit}>
      <div className="ChatWindow-InnerFormContainer absolute mt-6 transform -translate-x-full -translate-y-full top-[95%] left-full">
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
          {loading ? <Loader /> : <RiSendPlaneLine />}
        </button>
      </div>
      <output
        className="flex flex-wrap items-center pt-6 overflow-hidden transition-all"
        name={inputName}
      >
        {/* <span className="shrink-0">Your current Open Ai API Key: </span> */}
        <AutoAnimate className="max-h-[77vh] overflow-y-auto scrollbar-thin flex flex-col-reverse gap-2 ChatWindow-ChatMessages">
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
    </form>
  );
};
export default ChatWindow;
