import { Defect } from "../types/Defect";
import "../styles/DefectDetail.css";

interface ModalProps {
  defect: Defect | null;
  onClose: () => void;
}

const DefectDetail = ({ defect, onClose }: ModalProps) => {
  if (!defect) return null;

  const formattedDate = new Date(defect._reportingDate).toLocaleDateString();
  console.log(defect);
  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal">
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-content">
          <h2>{defect._object}</h2>
          <div className="modal-info">
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
              <strong>Status:</strong> {defect._status}
            </p>
          </div>
          {defect._image && (
            <div className="modal-image">
              <img src={defect._image} alt={`Image of ${defect._object}`} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DefectDetail;
