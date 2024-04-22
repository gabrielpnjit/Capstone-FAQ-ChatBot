import { NavLink } from "react-router-dom";

export default function Navbar() {

  return (
    <div>
      <nav className="p-4 rounded-md flex justify-between items-center mb-6 bg-blue-500 ">
        <NavLink to="/" className="text-xl text-white hover:text-gray-200 font-mono" >
          Capstone FAQ Bot Dashboard
        </NavLink>
        <div className="flex items-center space-x-5">
          <NavLink className="text-md text-white hover:text-gray-200 font-medium" to="/about">
          <button className="bg-white text-black inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-input hover:bg-slate-400 h-9 rounded-md px-3">
            About
          </button>
          </NavLink>
          <NavLink to="/checklogs">
            <button className="bg-white text-black inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-input hover:bg-slate-400 h-9 rounded-md px-3">
            View Logs
          </button>
        </NavLink>
        <NavLink to="/checkfiles">
          <button className="bg-white text-black inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-input hover:bg-slate-400 h-9 rounded-md px-3">
            File Manager
          </button>
        </NavLink>
        <NavLink to="/upload">
          <button className="bg-white text-black inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-input hover:bg-slate-400 h-9 rounded-md px-3">
            Upload File
          </button>
        </NavLink>
        </div>
      </nav>
    </div>
  );
}
