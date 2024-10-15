// DefectModal.tsx
import React, { useState } from "react";
import { Defect } from "../types/Defect"; // Asegúrate de importar la interfaz Defect

interface DefectModalProps {
  onClose: () => void;
  onSubmit: (defect: Defect) => void;
}

const DefectModal: React.FC<DefectModalProps> = ({ onClose, onSubmit }) => {
  const [defect, setDefect] = useState<Defect>({
    _object: "",
    _location: "",
    _description: "",
    _detailedDescription: "",
    _reportingDate: new Date(),
    _status: "open",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setDefect((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(defect);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily:'Arial'
      }}
    >
      <div style={{ background: "white", padding: 20, borderRadius: 5 }}>
        <h2>Report Defect</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Object:
              <input
                type="text"
                name="_object"
                value={defect._object}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Location:
              <input
                type="text"
                name="_location"
                value={defect._location}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Description:
              <textarea
                name="_description"
                value={defect._description}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Detailed Description:
              <textarea
                name="_detailedDescription"
                value={defect._detailedDescription}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Reporting Date:
              <input
                type="date"
                name="_reportingDate"
                value={defect._reportingDate.toISOString().split("T")[0]}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Status:
              <select
                name="_status"
                value={defect._status}
                onChange={handleChange}
              >
                <option value="open">Open</option>
                <option value="inwork">In Work</option>
                <option value="closed">Closed</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
          </div>
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default DefectModal;
