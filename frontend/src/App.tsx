import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Defects from "./screens/Defects";
import Financial from "./screens/Financial";
import Home from "./screens/Home";
import Layout from "./screens/Layout";
import NoPage from "./screens/NoPage";
import TenantHome from "./screens/TenantHome";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="defects" element={<Defects />} />
          <Route path="financial" element={<Financial />} />
          <Route path="tenanthome" element={<TenantHome />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);