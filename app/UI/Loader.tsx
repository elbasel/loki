interface LoaderProps {}
export const Loader: React.FC<LoaderProps> = ({}) => {
  return (
    <div className="flex mx-2 space-x-2 animate-pulse">
      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
    </div>
  );
};
