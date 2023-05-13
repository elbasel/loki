"use client";

import { AutoAnimate } from "@app/auto-animate";
import { Loader } from "@app/loader";
import { Fragment, useEffect, useRef, useState } from "react";
import { ChatMessage, type ChatMessageProps } from "./ChatMessage";
import { twMerge } from "tailwind-merge";
import { RiSendPlaneLine } from "react-icons/ri";
import { TextArea } from "@app/text-area";
import { Message } from "@app/open-ai/actions";

interface ChatWindowProps {
  onSubmit: (userPrompt: string) => any;
  loading: boolean;
  messages: Message[];
}
export const ChatWindow: React.FC<ChatWindowProps> = ({
  onSubmit,
  loading,
  messages,
}) => {
  const formRef = useRef(null);
  const outputRef = useRef(null);
  const [formValidationEnabled, setFormValidationEnabled] = useState(false);

  const handleSubmit = (formData: FormData) => {
    setFormValidationEnabled(true);
    const userPrompt = formData.get("user-prompt") as string;
    onSubmit(userPrompt);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      // submit the form
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (!outputRef.current) return;
    const outputElement = outputRef.current as HTMLOutputElement;
    outputElement.scroll({
      top: outputElement.scrollHeight + 99,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <>
      <output
        ref={outputRef}
        className="mt-auto overflow-y-auto scrollbar-thin"
      >
        <AutoAnimate className="flex flex-col gap-2">
          {messages.map((msg, i) => (
            <Fragment key={i}>
              <ChatMessage
                message={msg.message}
                className={twMerge(
                  msg.author === "human" && "flex-row-reverse"
                )}
              />
            </Fragment>
          ))}
        </AutoAnimate>
      </output>
      <form className="relative flex w-full gap-2 mt-4" action={handleSubmit}>
        <TextArea
          // TODO: forward this ref to the textarea
          // ref={formRef}
          required={formValidationEnabled}
          name="user-prompt"
          className={twMerge(
            "pr-11 max-h-64",
            formValidationEnabled && "invalid:!ring-2 invalid:!ring-red-700"
          )}
        />
        <button type="submit" className="flex items-center flex-1">
          {loading ? <Loader /> : <RiSendPlaneLine className="flex-1" />}
        </button>
      </form>
    </>
  );
};
export default ChatWindow;
