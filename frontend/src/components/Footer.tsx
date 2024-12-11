import React from 'react';
import "../styles/Footer.css"

const Footer: React.FC = () => {
  // Inline styles for the footer
  const footerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#add8e6', // Light blue background
    height: '120px', // Set the height
    width: '100%',
    fontFamily: 'Arial'
  };

  const contactStyle: React.CSSProperties = {
    color: 'white', // White text color
    fontSize: '15px', // Adjust font size as needed
    margin: '25px', // Space between contacts
    textAlign: 'center', // Center align text
  };

  return (
    <footer style={{...footerStyle}}>
      <div style={contactStyle}>
        <strong>Salvador Ramón Espinosa Merino</strong><br />
        Software Engineer<br />
        salvador-espinosa@htwg-konstanz.de
      </div>
      <div style={contactStyle}>
        <strong>Pablo Larraz Jordán</strong><br />
        Software Engineer<br />
        pablo-larraz@htwg-konstanz.de
      </div>
    </footer>
  );
};

export default Footer;
