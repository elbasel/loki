"use server";
import * as cheerio from "cheerio";

type GoogleSearchResult = {
  title: string;
  url: URL;
};
const SKIPPED_HOSTS = [
  "www.youtube.com",
  "support.google.com",
  "accounts.google.com",
];

export const getGoogleSearchResults = async (query: string, lang = "en") => {
  const searchResults: GoogleSearchResult[] = [];
  const extraURLS: URL[] = [];
  let UniqueHosts = new Set<string>();

  const urlToFetch = `https://www.google.com/search?q=${query
    .split(" ")
    .join("+")}&hl=${lang}`;

  const response = await fetch(urlToFetch);
  const html = await response.text();
  const $ = cheerio.load(html);
  const cheerioLinks = [...$("a")];

  cheerioLinks.forEach((link) => {
    const href = $(link).attr("href");

    // google search results links all start with /url?q=
    if (!href?.startsWith("/url?q=")) return;
    const url = new URL(href.replace("/url?q=", "").split("&")[0]);

    const host = url.host;
    if (SKIPPED_HOSTS.includes(host)) return;
    UniqueHosts.add(url.host);

    const title = $(link).find("h3").text();
    if (!title) return extraURLS.push(url);

    searchResults.push({ url, title });
  });

  return { searchResults, extraURLS, hosts: [...UniqueHosts.values()] };
};
