import React from 'react';
import logo from '../assets/cupra_logo.svg';
import profileIcon from '../assets/profile.svg';
import "../styles/GlobalReset.css"; 
import { useNavigate } from 'react-router-dom';
import colors from "../assets/colors.json";
import '../styles/Header.css';  // Import the CSS file

type Props = {
  headerText: string;
  setFunct: () => void;
  theme: number;
};

const Header: React.FC<Props> = ({ setFunct, headerText, theme }) => {

  const navigate = useNavigate();

  // Determine the appropriate header and title styles based on the theme
  const titleClass = theme < 5 ? 'title title-light' : 'title title-dark';
  const profileIconClass = theme < 5 ? 'profile-image profile-image-light' : 'profile-image profile-image-dark';

  return (
    <header className={'header'} style={{ backgroundColor: colors[theme as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 ]}}>
      <button
        onClick={() => navigate("/")}
        className="logo-button"
      >
        <img src={logo} alt="Cupra Logo" className="logo-image" />
      </button>
      <h1 className={titleClass}>{headerText}</h1>
      <button
        onClick={setFunct}
        className="profile-button"
      >
        <img src={profileIcon} alt="Profile Icon" className={profileIconClass} />
      </button>
    </header>
  );
};

export default Header;
