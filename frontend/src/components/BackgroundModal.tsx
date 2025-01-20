import React, { useState } from "react";
import "../styles/BackgroundModal.css";
import { User } from "../types/User";
import { useUser } from "../context/UserContext";

// Import background images manually
import background1 from "../assets/backgrounds/background1.svg";
import background2 from "../assets/backgrounds/background2.svg";
import background3 from "../assets/backgrounds/background3.svg";
import background4 from "../assets/backgrounds/background4.svg";
import background5 from "../assets/backgrounds/background5.svg";
import background6 from "../assets/backgrounds/background6.svg";
import background7 from "../assets/backgrounds/background7.svg";
import background8 from "../assets/backgrounds/background8.svg";
import background9 from "../assets/backgrounds/background9.svg";

interface BackgroundModalProps {
  onApply: (newTheme: number) => void; // Handle both updating the user and closing the modal
}

const BackgroundModal: React.FC<BackgroundModalProps> = ({ onApply }) => {
  const { user, tenant } = useUser();

  if (!user) {
    // Handle the case where user is null
    return (
      <div>
        There is no user currently logged in. Please log in and try again
      </div>
    ); // or any fallback UI
  }

  if (!tenant) {
    return (
      <div>
        The tenant has not been loaded correctly. Please try again later
      </div>
    ); // or any fallback UI
  }

  const [selectedBackground, setSelectedBackground] = useState<number>(
    tenant._theme || 1
  );

  // Backgrounds are now imported images, so we can reference them directly
  const backgrounds: string[] = [
    "",
    background1,
    background2,
    background3,
    background4,
    background5,
    background6,
    background7,
    background8,
    background9,
  ];

  const handleBackgroundClick = (background: number): void => {
    setSelectedBackground(background);
  };

  const handleApply = (): void => {
    onApply(selectedBackground);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select Background</h2>
        <div className="background-grid">
          {backgrounds.slice(1).map((background, index) => (
            <div
              key={index + 1} // Adjusted to keep key consistent with actual background index
              className={`background-item ${
                selectedBackground === index + 1 ? "selected" : ""
              }`}
              onClick={() => handleBackgroundClick(index + 1)} // Pass the actual index (not shifted)
            >
              <img
                src={background} // Use the image from the list
                alt={`background-${index + 1}`} // Alt text based on index
                className="background-image"
              />
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button className="apply-button" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundModal;
