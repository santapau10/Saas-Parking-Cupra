import React from 'react';
import "../styles/Footer.css"
import colors from "../assets/colors.json";

type Props = {
  theme: number;
};

const Footer: React.FC<Props> = ({theme}) => {
  // Inline styles for the footer
  const footerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors[theme as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 ], // Light blue background
    height: '120px', // Set the height
    width: '100%',
    fontFamily: 'Arial'
  };

  const contactStyle: React.CSSProperties = {
    color: theme < 5? 'black': 'white',
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
