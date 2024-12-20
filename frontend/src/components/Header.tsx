import React from 'react';
import logo from '../assets/cupra_logo.svg';
import profileIcon from '../assets/profile.svg';
import "../styles/GlobalReset.css"; 
import { useNavigate } from 'react-router-dom';

type Props = {
  headerText: string;
  setFunct: () => void;
};

const Header: React.FC<Props> = ({setFunct, headerText}) => {

  const navigate = useNavigate();

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Align items to the start
    backgroundColor: '#add8e6', // Light blue background
    height: '150px', // Set the height
    width: '100%'
  };

  const titleStyle: React.CSSProperties = {
    color: 'white', // White text color
    fontSize: '250%', // Adjust font size as needed
    margin: 0, // Remove default margin
    position: 'absolute', // Position the title absolutely
    left: '50%', // Center the title horizontally
    transform: 'translateX(-50%)', // Adjust for center alignment
    fontFamily: 'Arial'
  };

  return (
    <header style={headerStyle}>
      <button
      onClick={() => navigate("/")}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
      >
        <img src={logo} alt="Cupra Logo" style={{ width: 150, height: 150, marginLeft: 40 }} />
      </button>
      <h1 style={titleStyle}>{headerText}</h1>
      <button
        onClick={setFunct}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <img src={profileIcon} alt="Profile Icon" style={{ width: 40, height: 40, marginRight: 40 }} />
      </button>
    </header>
  );
};

export default Header;
