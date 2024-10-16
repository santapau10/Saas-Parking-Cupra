// App.tsx
import Button from "./components/Button";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ListGroup from "./components/ListGroup";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import DefectModal from "./components/DefectModal";
import { Defect } from "./types/Defect";
import background from "../src/assets/background.svg";

export default function App() {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const [showModal, setShowModal] = useState(false);
  const [defects, setDefects] = useState<Defect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState(""); // Estado para el filtro por ubicación
  const [statusFilter, setStatusFilter] = useState(""); // Estado para el filtro por estado

  const fetchDefects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://${apiUrl}/defects`);
      setDefects(response.data);
    } catch (err: any) {
      setError("Failed to load defects. Please try again later.");
      toast.error("Failed to load defects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefects(); // Cargar defectos al montar el componente
  }, []);

  const handleDefectSubmit = async (defect: Defect) => {
    try {
      console.log(defect);
      await axios.post(`http://${apiUrl}/defects`, defect);
      toast.success("Defect reported successfully!");
      await fetchDefects(); // Actualiza la lista después de agregar un nuevo defecto
    } catch (err: any) {
      toast.error("Failed to report defect. Please try again later.");
    }
  };

  // Función para filtrar por ubicación
  const filterByLocation = async () => {
    try {
      const response = await axios.get(
        `http://${apiUrl}/defects/filteredByLocation/${locationFilter}`
      );
      setDefects(response.data);
    } catch (err: any) {
      toast.error(
        "Failed to filter defects by location. Please try again later."
      );
    }
  };

  // Función para filtrar por estado
  const filterByStatus = async () => {
    try {
      const response = await axios.get(
        `http://${apiUrl}/defects/filteredByStatus/${statusFilter}`
      );
      setDefects(response.data);
    } catch (err: any) {
      toast.error(
        "Failed to filter defects by status. Please try again later."
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundImage: `url(${background})`,
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Header />
      {showModal && (
        <DefectModal
          onClose={() => setShowModal(false)}
          onSubmit={handleDefectSubmit}
        />
      )}
      <ToastContainer />

      <div style={{ display: "flex", gap: "10px" }}>
        <Button
          onClick={() => setShowModal(true)}
          style={{
            padding: 20,
            margin: 20,
            fontSize: 20,
            backgroundColor: "green",
          }}
        >
          Create defect
        </Button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Filter by location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
        <Button
          onClick={filterByLocation}
          style={{ padding: 10, margin: 20, width: 135 }}
        >
          Filter by Location
        </Button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
        <Button
          onClick={filterByStatus}
          style={{ padding: 10, margin: 20, width: 135 }}
        >
          Filter by Status
        </Button>
      </div>

      {loading ? (
        <p>Loading defects...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ListGroup items={defects} heading="Defect list" />
      )}

      <Footer />
    </div>
  );
}
