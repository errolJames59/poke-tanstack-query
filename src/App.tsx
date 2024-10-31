import { Outlet } from "react-router";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <main className="h-full p-4">
        <Outlet />
      </main>
    </>
  );
}

export default App;
