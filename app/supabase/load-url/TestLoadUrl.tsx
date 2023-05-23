"use client";

import { Button, InputWithRef, Output } from "@app/UI";
import { UrlInfo, type Message, loadUrl } from "@app/open-ai";
import { useCallback, useRef, useState } from "react";

const _getUrlInfo = async (url: string) => {
  //  the server returns an array of UrlInfo objects
  const urlInfoArray: UrlInfo[] = await loadUrl(url);
  if (urlInfoArray.length > 1) {
    console.error({ infoArray: urlInfoArray });
    throw new Error("server returned more than one UrlInfo object");
  }

  const urlInfo: UrlInfo = urlInfoArray[0];

  return urlInfo;
};

export const TestLoadUrl: React.FC = () => {
  const inputRef = useRef<any>();
  const [urlInfo, setUrlInfo] = useState<UrlInfo>();

  // get the url info on submit
  type _ServerResponse = "success" | "error";
  const handleSubmit = useCallback(async (): Promise<_ServerResponse> => {
    const url = inputRef.current.value;
    if (!url) {
      console.warn("form submitted with empty ur", { url });
      return "error";
    }

    const urlInfo: UrlInfo = await _getUrlInfo(url);
    setUrlInfo(urlInfo);
    return "success";
  }, []);

  return (
    <main>
      <h1>Test Load Url</h1>
      <InputWithRef ref={inputRef} />
      <Button onClick={handleSubmit} type="submit">
        Load URL into Long term ai memory
      </Button>
      <Output>
        <table>
          <tr>
            <thead>Site:</thead>
            <td>
              <a target="_blank" href={urlInfo?.url}>
                {urlInfo?.title}
              </a>
            </td>
          </tr>
          <tr>
            <thead>Url:</thead>
            <td>
              <a target="_blank" href={urlInfo?.url}>
                {urlInfo?.url}
              </a>
            </td>
          </tr>
        </table>
      </Output>
    </main>
  );
};
