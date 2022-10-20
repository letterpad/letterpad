const NotFound = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="px-4 lg:py-12">
        <div className="lg:flex lg:gap-4">
          <div className="flex flex-col items-center justify-center md:py-24 lg:py-32">
            <h1 className="text-9xl font-bold text-blue-500">404</h1>
            <p className="mb-2 text-center text-2xl font-bold text-gray-800 md:text-3xl">
              <span className="text-red-500">Oops!</span> Page not found
            </p>
            <p className="mb-8 text-center text-gray-500 md:text-lg">
              The page you're looking for doesn't exist.
            </p>
            <a
              href="https://letterpad.app"
              className="bg-blue-100 px-6 py-2 text-sm font-semibold text-blue-800"
            >
              Go home
            </a>
          </div>
          {/* <div className="mt-4" style={{ width: 400 }}>
            <Image
              src="http://www.storytrender.com/wp-content/uploads/2019/03/5_CATERS_PUPPIES_CATCHING_TREATS_01.jpg"
              alt="img"
              className="h-full w-full object-cover"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
