export const LoadingScreen = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-700 opacity-75">
      <div className="absolute bottom-1/2 right-1/2  translate-x-1/2 translate-y-1/2 transform ">
        <div className="h-20 w-20 animate-spin  rounded-full border-4 border-solid border-blue-400 border-t-transparent"></div>
      </div>
    </div>
  );
};
