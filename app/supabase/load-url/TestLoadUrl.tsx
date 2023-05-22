"use client";

import { Button, InputWithRef, Output } from "@app/UI";
import { type UrlInfo as UrlInfo, loadUrl } from "@app/open-ai/actions";
import { useEffect, useRef, useState } from "react";

type _ClientStatus = "idle" | "loading" | "success" | "warning" | "error";

export const TestLoadUrl: React.FC = () => {
  const inputRef = useRef<any>();
  const [serverResponse, setServerResponse] = useState<UrlInfo[]>();
  const [clientStatus, setClientStatus] = useState<_ClientStatus>("idle");
  const [urlToLoad, setUrlToLoad] = useState<string>("");
  const [urlInfo, setUrlInfo] = useState<UrlInfo>();

  const getUrlInfo = async (urlToLoad: string) => {
    const serverResponse: UrlInfo[] = await loadUrl(urlToLoad);
    const doc: UrlInfo = serverResponse[0];

    return doc;
  };

  const handleUrlChange = () => {

   if (!urlToLoad) return setClientStatus("idle");
    setClientStatus("loading");
    const urlInfo: UrlInfo = getUrlInfo(urlToLoad);

   
  };
  useEffect(() => {}, [urlToLoad]);

  return (
    <main>
      <h1>Test Load Url</h1>
      <InputWithRef ref={inputRef} />
      <Button
        onClick={() => setUrlToLoad(inputRef.current?.value)}
        type="submit"
      >
        Load URL into Long term ai memory
      </Button>
      <Output></Output>
    </main>
  );
};
