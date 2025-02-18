const Main = () => {
    const handleLogout = () => {
      localStorage.removeItem("token");
      window.location.reload();
    };
  
    return (
      <div className="w-full min-h-screen flex flex-col">
        <nav className="w-full h-[70px] bg-teal-400 flex items-center justify-between px-5">
          <h1 className="text-white text-2xl">welcome</h1>
          <button
            className="border-none outline-none py-3 px-6 bg-white text-teal-400 font-bold text-sm rounded-full cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
        <div className="flex justify-center items-center mt-[15%]">
          <h1 className="text-teal-400 text-5xl font-semibold text-center">
            WELCOME TO AUTHENTICATION
          </h1>
        </div>
      </div>
    );
  };
  
  export default Main;
  