import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./components/LoginButton";

const App = () => {
  const { isAuthenticated } = useAuth0();
  
  return (
    <div className="w-full p-6">
      <Navbar />
      {isAuthenticated ? (
        <Routes>
          <Route path="/" element={<Outlet />} />
        </Routes>
      ) : (
        <LoginButton />
      )}
      {/* <Outlet /> */}
    </div>
  );
};
export default App;