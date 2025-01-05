import React from 'react';
import "../styles/Footer.css";
import colors from "../assets/colors.json";

type Props = {
  theme: number;
};

const Footer: React.FC<Props> = ({theme}) => {
  // Determine the appropriate text color based on the theme

  return (
    <footer className={'footer'} style={{ marginTop: 100,  color: theme < 5 ? 'black' : 'white', backgroundColor: colors[theme as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 ]}}>
      <div className="contact">
        <strong>Salvador Ramón Espinosa Merino</strong><br />
        Software Engineer<br />
        salvador-espinosa@htwg-konstanz.de
      </div>
      <div className="contact">
        <strong>Pablo Larraz Jordán</strong><br />
        Software Engineer<br />
        pablo-larraz@htwg-konstanz.de
      </div>
    </footer>
  );
};

export default Footer;
