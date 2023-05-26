"use client";

export const dynamic = "force-dynamic";

import { TestSupabase } from "./TestSupabase";

export const fetchCache = "force-no-store";

const TestSupabasePage = () => {
  return <TestSupabase />;
};

export default TestSupabasePage;
