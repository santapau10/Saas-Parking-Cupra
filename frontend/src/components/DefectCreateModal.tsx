import React, { useState, useEffect } from "react";
import { Defect } from "../types/Defect";
import defaultImage from "../assets/default_image.jpg"; // Import the default image
import '../styles/DefectCreateModal.css';
import { useUser } from "../context/UserContext";
import { useLocation } from "react-router-dom";

interface DefectCreateModalProps {
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

const DefectCreateModal: React.FC<DefectCreateModalProps> = ({ onClose, onSubmit }) => {
  const [defect, setDefect] = useState<Defect>({
    _id: "",
    _parking: "",
    _description: "",
    _detailedDescription: "",
    _reportingDate: new Date(),
    _status: "open",
    _image: "",
    _username: "",
  });

  const [_image, set_image] = useState<File | null>(null);
  const [displayImage, setDisplayImage] = useState<string>(defaultImage);
  const { user } = useUser();
  const username = user ? user._username : "Guest";
  const location = useLocation();
  const parkingName = location ? location.pathname.replace("/parkings/", "") : "unknown";

  useEffect(() => {
    const fetchDefaultImage = async () => {
      const response = await fetch(defaultImage);
      const blob = await response.blob();
      const file = new File([blob], "defaultImage.jpg", { type: blob.type });
      set_image(file);
    };

    fetchDefaultImage();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setDefect((prev) => ({
      ...prev,
      [name]: name === "_reportingDate" ? new Date(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      set_image(file);
      const imageUrl = URL.createObjectURL(file);
      setDisplayImage(imageUrl);
      return () => URL.revokeObjectURL(imageUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("parking", parkingName);
    formData.append("description", defect._description);
    formData.append("detailedDescription", defect._detailedDescription);
    formData.append("reportingDate", defect._reportingDate.toISOString());
    formData.append("status", defect._status);
    formData.append("username", username)

    if (_image) {
      formData.append("image", _image);
    } else {
      console.log("No image file selected.");
    }

    console.log(formData)
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-header">Report Defect</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div>
          </div>
          <div>
            <label>
              <strong>Description:</strong>
              <textarea
                name="_description"
                value={defect._description}
                onChange={handleChange}
                required
                className="modal-textarea"
                maxLength={20}
              />
            </label>
          </div>
          <div>
            <label>
              <strong>Detailed Description:</strong>
              <textarea
                name="_detailedDescription"
                value={defect._detailedDescription}
                onChange={handleChange}
                required
                className="modal-textarea"
              />
            </label>
          </div>
          <div>
            <label>
              <strong>Reporting Date:</strong>
              <input
                type="date"
                name="_reportingDate"
                value={defect._reportingDate.toISOString().split("T")[0]}
                onChange={handleChange}
                required
                className="modal-input"
              />
            </label>
          </div>
          <div>
            <label>
              <strong>Status:</strong>
              <select
                name="_status"
                value={defect._status}
                onChange={handleChange}
                className="modal-select"
              >
                <option value="open">Open</option>
                <option value="inwork">In Work</option>
                <option value="closed">Closed</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
          </div>

          <div>
            <label>
              <strong>Image:</strong>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "block", marginTop: "5px" }}
              />
            </label>
          </div>

          <div className="modal-image-container">
            <img
              src={displayImage}
              alt="Selected"
              className="modal-image"
            />
          </div>

          <div className="modal-button-container">
            <button
              type="submit"
              className="modal-button modal-button-submit"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="modal-button modal-button-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DefectCreateModal;
