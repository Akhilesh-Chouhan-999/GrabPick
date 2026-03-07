import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

const PUBLIC_PATHS = ["/"];

function App() {
  const location = useLocation();
  const showNavbar = PUBLIC_PATHS.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <AppRoutes />
    </>
  );
}

export default App;
