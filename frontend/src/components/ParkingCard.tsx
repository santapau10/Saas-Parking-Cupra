import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faClipboard,
  faDoorOpen,
  faBuilding,
  faFlag,
  faToggleOff,
  faToggleOn,
  faDoorClosed,
  faLock,
  faLockOpen
} from "@fortawesome/free-solid-svg-icons";
import { Parking } from "../types/Parking";
import "../styles/ParkingCard.css";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import defaultImage from "../assets/cupra_logo.png";

interface DefectCardProps {
  parking: Parking;
  onEdit: (parkingId: string) => void;
}

const ParkingCard: React.FC<DefectCardProps> = ({parking, onEdit}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const { user, tenant } = useUser();
  const theme = tenant?._theme || 1;

  // Get the status class based on the status
  const getStatusClass = (status: string) => {
    switch (status) {
      case "open":
        return "parking-status-open";
      case "closed":
        return "parking-status-closed";
      default:
        return "parking-status-default";
    }
  };

  return (
    <div className={`parking-card ${theme < 6 ? "" : "theme-high"}`}>
      {/* Top half for the picture */}
      <div className="parking-image-container">
        <img
          src={parking._picture}
          alt={`${parking._name} parking`}
          className="parking-image"
          onError={(e) => {
            e.currentTarget.src = defaultImage; // Use the imported default image if there's an error
            e.currentTarget.alt = "Default parking image"; // Update alt text
          }}
        />
      </div>

      {/* Bottom half for attributes */}
      <div className="parking-details">
        <h2 className="parking-title">{parking._name}</h2>
        <p>
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          <strong> Address:</strong> {parking._address}
        </p>
        <p>
          <FontAwesomeIcon icon={faDoorOpen} />
          <strong> Barriers:</strong> {parking._barriers}
        </p>
        <p>
          <FontAwesomeIcon icon={faClipboard} />
          <strong> Capacity:</strong> {parking._capacity}
        </p>
        <p>
          <FontAwesomeIcon icon={faBuilding} />
          <strong> Floors:</strong> {parking._floors}
        </p>
        <p>
          <FontAwesomeIcon icon={faFlag} />
          <strong> Status:</strong>
          <span className={getStatusClass(parking._status)}> {parking._status}</span>
        </p>
        {user?._role == "admin" && <button
          className="edit-button"
          onClick={(event) => {
            event.stopPropagation();
            setShowEditModal(true);
          }}
        >
          <FontAwesomeIcon icon={parking._status == "open" ? faLock: faLockOpen} />
        </button>}
      </div>
      {showEditModal && (
        <div className="edit-modal">
          <p>Are you sure you want to toggle the status?</p>
          <button onClick={(event) => { event.stopPropagation(); setShowEditModal(false)} }>Cancel</button>
          <button onClick={(event) => { event.stopPropagation(); onEdit(parking._name);} }>Toggle</button>
        </div>
      )}
    </div>
  );
};

export default ParkingCard;
