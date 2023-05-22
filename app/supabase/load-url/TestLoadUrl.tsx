"use client";

import { Button, InputWithRef, Output } from "@app/UI";
import { type LokiDoc, loadUrl } from "@app/open-ai/actions";
import { useRef, useState } from "react";

type relevantInfo = string[];
type ClientStatus = "idle" | "loading" | "success" | "error" | string;

export const TestLoadUrl: React.FC = () => {
  const inputRef = useRef<any>();
  //   const [relevantInfo, setRelevantInfo] = useState<relevantInfo>([])
  const [serverResponse, setServerResponse] = useState<any>(null);
  const [clientStatus, setClientStatus] = useState<ClientStatus>("idle");

  const getServerResponse = async () => {
    const urlToLoad = inputRef.current?.value;
    if (!urlToLoad)
      return setClientStatus("error: the value of the input is == null");
    setClientStatus("loading");
    const serverResponse: LokiDoc[] = await loadUrl(urlToLoad);
    const { url, title, html }: LokiDoc = serverResponse[0];
    setServerResponse(serverResponse);
    setClientStatus("success");
  };

  return (
    <main>
      <h1>Test Load Url</h1>
      <form>
        <InputWithRef ref={inputRef} />
        <Button type="submit">Load URL into Long term ai memory</Button>
        <Output></Output>
      </form>
    </main>
  );
};
