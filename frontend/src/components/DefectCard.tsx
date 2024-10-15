import React from "react";
import { Defect } from "../types/Defect";

// The DefectCard component
const DefectCard = (defect: Defect) => {
  // Format the date for display
  const formattedDate = new Date(defect._reportingDate).toLocaleDateString();

  // Function to return color based on status
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
    <div className="defect-card">
      <h2 className="defect-title">{defect._object}</h2>
      <p>
        <strong>Location:</strong> {defect._location}
      </p>
      <p>
        <strong>Description:</strong> {defect._description}
      </p>
      <p>
        <strong>Details:</strong> {defect._detailedDescription}
      </p>
      <p>
        <strong>Reported On:</strong> {formattedDate}
      </p>
      <p>
        <strong>Status:</strong>
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
