import React, { useState } from "react";
import '../styles/ParkingCreateModal.css';
import defaultImage from "../assets/default_image.jpg"; // Import the default image
import { useUser } from "../context/UserContext";

interface ParkingCreateModalProps {
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

const ParkingCreateModal: React.FC<ParkingCreateModalProps> = ({ onClose, onSubmit }) => {
  const { tenant } = useUser();

  const [parking, setParking] = useState({
    _name: "",
    _address: "",
    _barriers: "1",
    _capacity: "1",
    _floors: "1",
    _picture: "",
    _status: "open",
  });

  const [_picture, set_picture] = useState<File | null>(null);
  const [displayImage, setDisplayImage] = useState<string>(defaultImage);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Directly store the value as a string
    setParking((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // If the value is "1", remove the leading zero when focused
    if (e.target.value === "1") {
      e.target.value = ""; // Remove the one when focus is applied
      setParking((prev) => ({
        ...prev,
        [e.target.name]: "", // Clear the value in state as well
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      set_picture(file);
      const imageUrl = URL.createObjectURL(file);
      setDisplayImage(imageUrl);
      return () => URL.revokeObjectURL(imageUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", parking._name);
    formData.append("address", parking._address);
    formData.append("barriers", parking._barriers); // Stored as string
    formData.append("capacity", parking._capacity); // Stored as string
    formData.append("floors", parking._floors); // Stored as string
    formData.append("status", parking._status);

    if (_picture) {
      formData.append("picture", _picture);
    } else {
      console.log("No picture file selected.");
    }

    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-header">Create Parking</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div>
            <label>
              <strong>Name:</strong>
              <input
                type="text"
                name="_name"
                value={parking._name}
                onChange={handleChange}
                required
                className="modal-input"
              />
            </label>
          </div>
          <div>
            <label>
              <strong>Address:</strong>
              <input
                type="text"
                name="_address"
                value={parking._address}
                onChange={handleChange}
                required
                className="modal-input"
              />
            </label>
          </div>
          <div>
            <label>
              <strong>Barriers:</strong>
              <input
                type="text"
                name="_barriers"
                value={parking._barriers}
                onChange={handleChange}
                onFocus={handleFocus}
                required
                className="modal-input"
              />
            </label>
          </div>
          <div>
            <label>
              <strong>Capacity:</strong>
              <input
                type="text"
                name="_capacity"
                value={parking._capacity}
                onChange={handleChange}
                onFocus={handleFocus}
                required
                className="modal-input"
              />
            </label>
          </div>
          <div>
            <label>
              <strong>Floors:</strong>
              <input
                type="text"
                name="_floors"
                value={parking._floors}
                onChange={handleChange}
                onFocus={handleFocus}
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
                value={parking._status}
                onChange={handleChange}
                className="modal-select"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </label>
          </div>
          { tenant?._plan != "free" && 
          <div>
            <div>
            <label>
              <strong>Picture:</strong>
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
          </div>
          }
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

export default ParkingCreateModal;
