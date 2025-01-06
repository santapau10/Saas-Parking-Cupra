import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faClipboard,
  faInfoCircle,
  faCalendarAlt,
  faFlag,
  faUserAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Defect } from "../types/Defect";
import "../styles/DefectCard.css";
import { useUser } from "../context/UserContext";

interface DefectCardProps {
  defect: Defect;
  onDelete: (defectId: string) => void;
}

const DefectCard: React.FC<DefectCardProps> = ({defect, onDelete}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const theme = useUser().tenant?._theme || 1;

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
      className={`defect-card ${theme < 6 ? "" : "theme-high"}`}
      onClick={() => console.log("Card clicked!")}
    >
      <h2 className="defect-title">{defect._object}</h2>
      <button
        className="delete-button"
        onClick={(event) => {
          event.stopPropagation(); // Prevent the click from bubbling to the card
          setShowDeleteModal(true);
          onDelete("J1o63L4BVXKoGCOtVMjw");
        }}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
      <p>
        <FontAwesomeIcon icon={faMapMarkerAlt} /> <strong> Parking:</strong>{" "}
        {defect._parking}
      </p>
      <p>
        <FontAwesomeIcon icon={faClipboard} /> <strong> Description:</strong>{" "}
        {defect._description}
      </p>
      <p>
        <FontAwesomeIcon icon={faInfoCircle} /> <strong> Details:</strong>{" "}
        {defect._detailedDescription}
      </p>
      <p>
        <FontAwesomeIcon icon={faCalendarAlt} /> <strong> Reported On:</strong>{" "}
        {new Date(defect._reportingDate).toLocaleDateString()}
      </p>
      <p>
        <FontAwesomeIcon icon={faFlag} /> <strong> Status:</strong>{" "}
        <span className={getStatusClass(defect._status)}>
          {defect._status}
        </span>
      </p>
      <p>
        <FontAwesomeIcon icon={faUserAlt} /> <strong> Reported by:</strong>{" "}
        {defect._username.length < 16
          ? defect._username
          : defect._username.substring(0, 14) + "..."}
      </p>

      {showDeleteModal && (
        <div className="delete-modal">
          <p>Are you sure you want to delete this defect?</p>
          <button onClick={(event) => { event.stopPropagation(); setShowDeleteModal(false)} }>Cancel</button>
          <button onClick={(event) => { event.stopPropagation(); console.log("Defect deleted!")} }>
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default DefectCard;
