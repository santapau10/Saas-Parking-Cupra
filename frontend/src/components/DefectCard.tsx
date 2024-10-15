import React from 'react';
import { Defect } from '../types/Defect';

// The DefectCard component
const DefectCard = (defect: Defect) => {

  // Format the date for display
  const formattedDate = new Date(defect.reportingDate).toLocaleDateString();

  // Function to return color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'green';
      case 'inwork':
        return 'blue';
      case 'closed':
        return 'gray';
      case 'rejected':
        return 'red';
      default:
        return 'black';
    }
  };

  return (
    <div className="defect-card">
      <h2 className="defect-title">{defect.object}</h2>
      <p><strong>Location:</strong> {defect.location}</p>
      <p><strong>Description:</strong> {defect.description}</p>
      <p><strong>Details:</strong> {defect.detailedDescription}</p>
      <p><strong>Reported On:</strong> {formattedDate}</p>
      <p>
        <strong>Status:</strong> 
        <span style={{ color: getStatusColor(status), fontWeight: 'bold' }}> {status}</span>
      </p>
    </div>
  );
};

export default DefectCard;
