"use client";

import { Fragment, useEffect, useState } from "react";
import { Output } from "@app/UI";
import { Loader } from "@app/UI";
import { ChatMessage } from "./ChatMessage";
import { twMerge } from "tailwind-merge";
import { RiSendPlaneLine } from "react-icons/ri";
import { TextArea } from "@app/UI/text-area";
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
  const [formValidationEnabled, setFormValidationEnabled] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");

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
        // console.log({ textAreaElem, submitButton });
        throw new Error("no submit button found");
      }
      submitButton.click();
    }
  };

  useEffect(() => {
    if (!userPrompt) return;
    onSubmit(userPrompt);
    const textAreaElem = document.querySelector(
      "textarea"
    ) as HTMLTextAreaElement;
    if (!textAreaElem) return;
    textAreaElem.style.height = "auto";
    textAreaElem.value = "";
    textAreaElem.textContent = "";
    setFormValidationEnabled(false);
    // adding onSubmit here will cause an infinite render loop, it's perfectly fine to have userPrompt only!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPrompt]);

  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      handleKeyPress(e);
    };

    document.addEventListener("keydown", onKeyPress);
    return () => {
      document.removeEventListener("keydown", onKeyPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    }, 300);
  }, [messages]);

  return (
    <form
      action={(formData: FormData) => {
        setFormValidationEnabled(true);
        const userPrompt = formData.get("user-prompt") as string;
        setUserPrompt(userPrompt);
      }}
      className="overflow-y-auto flex flex-col max-h[100svh]"
    >
      <Output
        id="chat-window-output"
        className="max-h-[83vh] flex flex-col gap-2 mt-auto mb-4 overflow-y-auto scrollbar-thin"
      >
        {/* <AutoAnimate className="flex flex-col gap-2"> */}
        {messages.map((msg, i) => (
          <Fragment key={i}>
            <ChatMessage
              message={msg?.text}
              className={twMerge(msg?.author === "human" && "flex-row-reverse")}
            />
          </Fragment>
        ))}
        {/* </AutoAnimate> */}
      </Output>
      <div className="relative w-full gap-2 p-2">
        <TextArea
          required={formValidationEnabled}
          id="chat-window-text-area"
          name="user-prompt"
          className={twMerge(
            formValidationEnabled && "invalid:!ring-2 invalid:!ring-red-700",
            loading && "opacity-50 cursor-not-allowed pointer-events-none"
          )}
          placeholder={loading ? "Thinking..." : "Type something..."}
        />
        <button
          id="chat-window-submit-button"
          type="submit"
          className="items-center flex-1 hidden"
        >
          {loading ? <Loader /> : <RiSendPlaneLine className="flex-1" />}
        </button>
      </div>
    </form>
  );
};
export default ChatWindow;
