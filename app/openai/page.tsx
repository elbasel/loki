import { TestOpenAiPage } from "./TestOpenAiPageProps";

interface OpenAiPageProps {
  children?: React.ReactNode;
}
const OpenAiPage: React.FC<OpenAiPageProps> = ({ children }) => {
  return (
    <>
      <TestOpenAiPage />
    </>
  );
};
export default OpenAiPage;
