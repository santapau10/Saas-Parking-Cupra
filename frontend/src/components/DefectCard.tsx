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

  const { user, tenant } = useUser()
  const theme = tenant?._theme || 1;

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
    >
      <h2 className="defect-title">{defect._description}</h2>
      {user?._role == "admin" && <button
        className="delete-button"
        onClick={(event) => {
          event.stopPropagation(); // Prevent the click from bubbling to the card
          setShowDeleteModal(true);
        }}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>}
      <p>
        <FontAwesomeIcon icon={faInfoCircle} /> <strong> Details:</strong>{" "}
        {defect._detailedDescription.length < 18
          ? defect._detailedDescription
          : defect._detailedDescription.substring(0, 20) + "..."}
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
        {defect._username.length < 18
          ? defect._username
          : defect._username.substring(0, 20) + "..."}
      </p>

      {showDeleteModal && (
        <div className="delete-modal">
          <p>Are you sure you want to delete this defect?</p>
          <button onClick={(event) => { event.stopPropagation(); setShowDeleteModal(false)} }>Cancel</button>
          <button onClick={(event) => { event.stopPropagation(); onDelete(defect._id);} }>
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default DefectCard;
