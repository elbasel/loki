"use client";
import { useState } from "react";
import { type QueryResult, getGoogleSearchResults } from "./actions";

const TestGooglePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [queryResult, setQueryResult] = useState<QueryResult>();

  const handleSubmit = async () => {
    const queryResult = await getGoogleSearchResults(searchQuery);
    console.log({ queryResult });
    setQueryResult(queryResult);
  };

  return (
    <form action={handleSubmit}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="btn" type="submit">
        Search
      </button>
      {queryResult && (
        <output>
          <ul>
            {queryResult.searchResults.map((result) => (
              <li key={result.title}>
                <a href={result.url}>{result.title}</a>
              </li>
            ))}
          </ul>
        </output>
      )}
    </form>
  );
};

export default TestGooglePage;
