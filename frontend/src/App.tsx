import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ParkingDetails from "./screens/ParkingDetails";
import Financial from "./screens/Financial";
import Home from "./screens/Home";
import Layout from "./screens/Layout";
import NoPage from "./screens/NoPage";
import TenantHome from "./screens/TenantHome";
import { UserProvider } from './context/UserContext'; // Import the UserProvider

export default function App() {
  return (
    <UserProvider> {/* Wrap the app with the UserProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/parkings/:parkingName" element={<ParkingDetails />} />
            <Route path="financial" element={<Financial />} />
            <Route path="tenanthome" element={<TenantHome />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
