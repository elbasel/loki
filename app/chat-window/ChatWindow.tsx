"use client";

import { AutoAnimate, Output } from "@app/UI";
import { Loader } from "@app/loader";
import { Fragment, useEffect, useRef, useState } from "react";
import { ChatMessage, type ChatMessageProps } from "./ChatMessage";
import { twMerge } from "tailwind-merge";
import { RiSendPlaneLine } from "react-icons/ri";
import { TextArea } from "@app/text-area";
import { _Message } from "@app/open-ai/actions";

interface ChatWindowProps {
  onSubmit: (userPrompt: string) => any;
  loading: boolean;
  messages: _Message[];
}
export const ChatWindow: React.FC<ChatWindowProps> = ({
  onSubmit,
  loading,
  messages,
}) => {
  // const textAreaRef = useRef(null);
  const outputRef = useRef(null);
  const [formValidationEnabled, setFormValidationEnabled] = useState(false);

  const handleSubmit = (formData: FormData) => {
    setFormValidationEnabled(true);
    const userPrompt = formData.get("user-prompt") as string;
    if (!userPrompt) return;
    onSubmit(userPrompt);
    const textAreaElem = document.querySelector(
      "textarea"
    ) as HTMLTextAreaElement;
    if (!textAreaElem) return;
    textAreaElem.value = "";
    textAreaElem.textContent = "";
    setFormValidationEnabled(false);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      // submit the form
      const textAreaElem = document.querySelector(
        "#chat-window-text-area"
      ) as HTMLTextAreaElement;
      const submitButton: HTMLButtonElement | null = document.querySelector(
        "#chat-window-submit-button"
      );
      if (!submitButton) {
        console.log({ textAreaElem, submitButton });
        throw new Error("no submit button found");
      }
      submitButton.click();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const outputElement = document.querySelector(
      "#chat-window-output"
    ) as HTMLDivElement;
    if (!outputElement) return;
    // defer scrolling to after UI update
    setTimeout(() => {
      outputElement.scroll({
        top: outputElement.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  }, [messages]);

  return (
    <form
      action={handleSubmit}
      className="max-h-[100svh] overflow-y-auto"
    >
      <Output
        id="chat-window-output"
        className="mt-auto overflow-y-auto scrollbar-thin"
      >
        <AutoAnimate className="flex flex-col gap-2">
          {messages.map((msg, i) => (
            <Fragment key={i}>
              <ChatMessage
                message={msg.text}
                className={twMerge(
                  msg.author === "human" && "flex-row-reverse"
                )}
              />
            </Fragment>
          ))}
        </AutoAnimate>
      </Output>
      <div className="relative flex w-full gap-2 p-2">
        <TextArea
          // TODO: forward this ref to the textarea
          // ref={textAreaRef}
          required={formValidationEnabled}
          id="chat-window-text-area"
          name="user-prompt"
          className={twMerge(
            "pr-11 max-h-64",
            formValidationEnabled && "invalid:!ring-2 invalid:!ring-red-700"
          )}
        />
        <button
          id="chat-window-submit-button"
          type="submit"
          className="flex items-center flex-1"
        >
          {loading ? <Loader /> : <RiSendPlaneLine className="flex-1" />}
        </button>
      </div>
    </form>
  );
};
export default ChatWindow;
