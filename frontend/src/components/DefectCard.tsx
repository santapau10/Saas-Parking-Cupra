import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faClipboard,
  faInfoCircle,
  faCalendarAlt,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import { Defect } from "../types/Defect";

const DefectCard = (defect: Defect) => {
  // Formatear la fecha
  const formattedDate = new Date(defect._reportingDate).toLocaleDateString();

  // Función para retornar el color basado en el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "green";
      case "inwork":
        return "blue";
      case "closed":
        return "gray";
      case "rejected":
        return "red";
      default:
        return "black";
    }
  };

  return (
    <div
      className="defect-card"
      style={{
        fontFamily: "Arial",
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
      }}
    >
      <h2 className="defect-title">{defect._object}</h2>
      <p>
        <FontAwesomeIcon icon={faMapMarkerAlt} /> {/* Icono de ubicación */}
        <strong> Location:</strong> {defect._location}
      </p>
      <p>
        <FontAwesomeIcon icon={faClipboard} /> {/* Icono de descripción */}
        <strong> Description:</strong> {defect._description}
      </p>
      <p>
        <FontAwesomeIcon icon={faInfoCircle} /> {/* Icono de detalles */}
        <strong> Details:</strong> {defect._detailedDescription}
      </p>
      <p>
        <FontAwesomeIcon icon={faCalendarAlt} /> {/* Icono de fecha */}
        <strong> Reported On:</strong> {formattedDate}
      </p>
      <p>
        <FontAwesomeIcon icon={faFlag} /> {/* Icono de estado */}
        <strong> Status:</strong>
        <span
          style={{ color: getStatusColor(defect._status), fontWeight: "bold" }}
        >
          {" "}
          {defect._status}
        </span>
      </p>
    </div>
  );
};

export default DefectCard;
