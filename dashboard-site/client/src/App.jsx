import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="w-full p-6">
      <Navbar />
      
      <div className="flex justify-center items-center mx-4 space-x-4">
        <div className="p-6 w-96 bg-gray-300 rounded-lg w">
          <div className="text-left">
            <h5 className="font-sans-serif text-2xl font-semibold">
              Leverage the power of LLMs to answer your Capstone questions!
            </h5>
            <h4 className="pt-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </h4>
          </div>        
        </div> {/* Gray panel */}
        <div className="flex-grow p-6 bg-white rounded-lg shadow-lg">
          INSERT GIF OF BOT IN ACTION HERE
        </div> {/* White panel with shadow */}
      </div>

    </div>
  );
};
export default App;