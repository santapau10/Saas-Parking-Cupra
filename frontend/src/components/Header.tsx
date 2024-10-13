import React from 'react';
import logo from '../assets/cupra_logo.svg';

const Header = () => {
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the start
    backgroundColor: '#add8e6', // Light blue background
    height: '150px', // Set the height
    marginBottom: '30px', // Ensure this has a unit (px)
    width: '100%',
    position: 'relative', // Position relative for further styling if needed
  };

  const logoStyle: React.CSSProperties = {
    marginRight: '30px', // Space between logo and text
    marginLeft: '20px',
    height: '60%', // Adjust logo height to fit within the header
  };

  const titleStyle: React.CSSProperties = {
    color: 'white', // White text color
    fontSize: '250%', // Adjust font size as needed
    margin: 0, // Remove default margin
    position: 'absolute', // Position the title absolutely
    left: '50%', // Center the title horizontally
    transform: 'translateX(-50%)', // Adjust for center alignment
  };

  return (
    <header style={headerStyle}>
      <img src={logo} alt="Cupra Logo" style={logoStyle} />
      <h1 style={titleStyle}>Defects</h1>
    </header>
  );
};

export default Header;
