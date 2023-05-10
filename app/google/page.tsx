"use client";
import { getGoogleSearchResults } from "./actions";

const TestGooglePage = () => {
  return (
    <div>
      <button
        onClick={async () => {
          const result = await getGoogleSearchResults(
            "How to use the useEffect Hook?"
          );
          console.log(result);
        }}
      >
        Test
      </button>
    </div>
  );
};

export default TestGooglePage;
