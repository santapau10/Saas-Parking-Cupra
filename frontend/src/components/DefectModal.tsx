import React, { useState, useEffect } from "react";
import { Defect } from "../types/Defect";
import defaultImage from "../assets/default_image.svg"; // Import the default image

interface DefectModalProps {
  onClose: () => void;
  onSubmit: (formData: FormData) => void; // Update type to expect FormData
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

  const [_image, set_image] = useState<File | string>(defaultImage);
  const [displayImage, setDisplayImage] = useState<string>(defaultImage);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "_reportingDate") {
      setDefect((prev) => ({
        ...prev,
        [name]: new Date(value),
      }));
    } else {
      setDefect((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      set_image(file);
      const imageUrl = URL.createObjectURL(file);
      setDisplayImage(imageUrl);

      // Clean up the object URL after the component re-renders
      return () => URL.revokeObjectURL(imageUrl);
    } else {
      set_image(defaultImage); // Revert to default if no file selected
      setDisplayImage(defaultImage);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("_object", defect._object);
    formData.append("_location", defect._location);
    formData.append("_description", defect._description);
    formData.append("_detailedDescription", defect._detailedDescription);
    formData.append("_reportingDate", defect._reportingDate.toISOString());
    formData.append("_status", defect._status);

    if (_image instanceof File) {
      formData.append("_image", _image); // Append only if _image is a File object
    }

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }    

    onSubmit(formData); // Pass formData instead of defect object
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
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 5,
          width: "400px",
          height: "500px",
          overflowY: "auto",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Report Defect</h2>
        <form onSubmit={handleSubmit}>
          {/* Other input fields remain unchanged */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Object:</strong>
              <input
                type="text"
                name="_object"
                value={defect._object}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Location:</strong>
              <input
                type="text"
                name="_location"
                value={defect._location}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Description:</strong>
              <textarea
                name="_description"
                value={defect._description}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Detailed Description:</strong>
              <textarea
                name="_detailedDescription"
                value={defect._detailedDescription}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Reporting Date:</strong>
              <input
                type="date"
                name="_reportingDate"
                value={defect._reportingDate.toISOString().split("T")[0]}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>
              <strong>Status:</strong>
              <select
                name="_status"
                value={defect._status}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              >
                <option value="open">Open</option>
                <option value="inwork">In Work</option>
                <option value="closed">Closed</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
          </div>

          {/* Image Selection */}
          <div style={{ marginBottom: "15px" }}>
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

          {/* Display the image */}
          <div style={{ marginBottom: "15px", textAlign: "center" }}>
            <img
              src={displayImage}
              alt="Selected"
              style={{
                maxWidth: "50%",
                height: "auto",
                border: "1px solid #ccc",
                padding: "5px",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              type="submit"
              style={{
                padding: "10px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DefectModal;
