import { BrowserRouter } from "react-router-dom";

// Pages

// Components
import Navbar from "./components/Navbar";
import AppRoutes from "./routes";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="pages">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
