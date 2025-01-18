import Button from "../components/Button";
import DefectList from "../components/DefectList";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import DefectCreateModal from "../components/DefectCreateModal";
import { Defect } from "../types/Defect";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../context/UserContext";
import { useLocation } from "react-router-dom";
import { Parking } from "../types/Parking";

export default function App() {
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  // const apiUrl = "http://localhost:3001"
  const [showModal, setShowModal] = useState(false);
  const [defects, setDefects] = useState<Defect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [parkingData, setParkingData] = useState<Parking | null>(null);

  const { tenant, token } = useUser();
  const location = useLocation();
  const parkingName = location?.pathname.replace("/parkings/", "") || "parkingA";

  const parseSingleParkingData = (item: any): Parking => {
    return {
        _name: item.name ?? "", // Fallback to an empty string if name is missing
        _address: item.address ?? "",
        _barriers: item.barriers ?? 0,
        _tenant_id: item.tenant_id ?? "",
        _capacity: item.capacity ?? 0,
        _floors: item.floors ?? 0,
        _picture: item.picture ?? "",
        _status: item.status ?? "closed", // Default to "closed" if status is missing
    };
  };

  const parseDefectData = (data: any[]): Defect[] => {
    return data.map((item) => ({
        _id: item.id ?? "", 
        _parking: item.parking ?? "",
        _description: item.description ?? "", 
        _detailedDescription: item.detailedDescription ?? "", 
        _reportingDate: item.reportingDate ?? "", 
        _status: item.status ?? "open",
        _image: item.image ?? "", 
        _username: item.username ?? "", 
    }));
};

  const fetchParkingData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/property-management/parkings/byName/${parkingName}`
      );
      const parsedData = parseSingleParkingData(response.data);
      setParkingData(parsedData);
    } catch (err: any) {
      setError("Failed to load parking information. Please try again later.");
      toast.error(err);
    }
  };

  const fetchDefects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${apiUrl}/property-management/defects/${parkingData?._tenant_id}/${parkingName}`);
      const parsedDefects = parseDefectData(response.data)
      setDefects(parsedDefects);
    } catch (err: any) {
      setError("Failed to load defects. Please try again later.");
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkingData();
  }, [parkingName]);

  useEffect(() => {
    if (parkingData) {
      fetchDefects();
    }
  }, [parkingData]);

  const handleDefectSubmit = async (defect: FormData) => {
    try {
      await axios.post(`${apiUrl}/property-management/defects/${parkingData?._tenant_id}`, defect, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Defect reported successfully!");
      await fetchDefects();
    } catch (err: any) {
      toast.error("Failed to report defect. Please try again later.");
    }
  };

  const handleDefectDelete = async (defectId: string) => {
    try {
      await axios.delete(`${apiUrl}/property-management/defects/${defectId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });
      toast.success("Defect deleted successfully!");
      await fetchDefects();
    } catch (err: any) {
      toast.error(`Failed to delete defect ${defectId}. Please try again later.`);
    }
  };

  const filterByStatus = async () => {
    if (!statusFilter && parkingData) {
      await fetchDefects();
      return;
    }
    try {
      const response = await axios.get(`${apiUrl}/property-management/defects/${parkingName}/filteredByStatus/${statusFilter}`);
      setDefects(response.data);
    } catch (err: any) {
      toast.error("Failed to filter defects by status. Please try again later.");
    }
  };

  if (!parkingData && error) return <div style={{margin: 20}}>Sorry, this parking does not exist.</div>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {showModal && (
        <DefectCreateModal
          onClose={() => setShowModal(false)}
          onSubmit={handleDefectSubmit}
        />
      )}

      <ToastContainer />

      {/* Display Parking Details */}
      {parkingData && (
        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
            width: "350px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            background: tenant && tenant._theme < 6 ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.5)",
          }}
        >
          <h2>{parkingData._name}</h2>
          <p>
            <strong>Address:</strong> {parkingData._address}
          </p>
          <p>
            <strong>Barriers:</strong> {parkingData._barriers}
          </p>
          <p>
            <strong>Capacity:</strong> {parkingData._capacity}
          </p>
          <p>
            <strong>Floors:</strong> {parkingData._floors}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: parkingData._status === "open" ? "green" : "red",
              }}
            >
              {parkingData._status}
            </span>
          </p>
        </div>
      )}
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
        <p style={{ fontFamily: "Arial" }}>Loading defects...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <DefectList items={defects} heading="Defect list" onDelete={(defectId) => handleDefectDelete(defectId)} />
      )}
    </div>
  );
}
