import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faClipboard,
  faInfoCircle,
  faCalendarAlt,
  faFlag,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Defect } from "../types/Defect";
import "../styles/DefectCard.css";
import { useUser } from '../context/UserContext';

const DefectCard = (defect: Defect) => {
  // Format the date
  const formattedDate = new Date(defect._reportingDate).toLocaleDateString();

  const theme = useUser().tenant?._theme || 1;

  // Get the status class based on the status
  const getStatusClass = (status: string) => {
    switch (status) {
      case "open":
        return "defect-status-open";
      case "inwork":
        return "defect-status-inwork";
      case "closed":
        return "defect-status-closed";
      case "rejected":
        return "defect-status-rejected";
      default:
        return "defect-status-default";
    }
  };

  return (
    <div
      className={`defect-card ${theme < 7 ? "" : "theme-high"}`}
    >
      <h2 className="defect-title">{defect._object}</h2>
      <p>
        <FontAwesomeIcon icon={faMapMarkerAlt} /> {/* Location Icon */}
        <strong> Parking:</strong> {defect._parking}
      </p>
      <p>
        <FontAwesomeIcon icon={faClipboard} /> {/* Description Icon */}
        <strong> Description:</strong> {defect._description}
      </p>
      <p>
        <FontAwesomeIcon icon={faInfoCircle} /> {/* Details Icon */}
        <strong> Details:</strong> {defect._detailedDescription}
      </p>
      <p>
        <FontAwesomeIcon icon={faCalendarAlt} /> {/* Date Icon */}
        <strong> Reported On:</strong> {formattedDate}
      </p>
      <p>
        <FontAwesomeIcon icon={faFlag} /> {/* Status Icon */}
        <strong> Status:</strong>
        <span className={getStatusClass(defect._status)}>
          {" "}
          {defect._status}
        </span>
      </p>
      <p>
        <FontAwesomeIcon icon={faUserAlt} /> {/* Reporter Icon */}
        <strong> Reported by:</strong> {defect._username || "Anonymous"}
      </p>
    </div>
  );
};

export default DefectCard;
