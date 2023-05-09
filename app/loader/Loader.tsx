interface LoaderProps {}
export const Loader: React.FC<LoaderProps> = ({}) => {
  return (
    <span className="inline-block w-4 h-4 mx-2 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader"></span>
  );
};
export default Loader;
