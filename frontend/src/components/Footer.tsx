import React from 'react';

const Footer: React.FC = () => {
  // Inline styles for the footer
  const footerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#add8e6', // Light blue background
    height: '120px', // Set the height
    marginTop: '30px', // Space above the footer
    width: '100%',
    position: 'relative', // Position relative for further styling if needed
    padding: '10px', // Add some padding
  };

  const contactStyle: React.CSSProperties = {
    color: 'white', // White text color
    fontSize: '15px', // Adjust font size as needed
    margin: '25px', // Space between contacts
    textAlign: 'center', // Center align text
  };

  return (
    <footer style={{...footerStyle, marginTop: 300}}>
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
