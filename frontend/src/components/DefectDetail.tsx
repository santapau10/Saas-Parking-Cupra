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
          <h2>{defect._description}</h2>
          <div className="modal-info">
            <p>
              <strong>Details:</strong> {defect._detailedDescription}
            </p>
            <p>
              <strong>Reported On:</strong> {formattedDate}
            </p>
            <p>
              <strong>Status:</strong> {defect._status}
            </p>
            <p>
              <strong>Reported by:</strong> {defect._username}
            </p>
          </div>
          {defect._image && (
            <div className="modal-image">
              <img src={defect._image} alt={`Image of ${defect._id}`} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DefectDetail;
