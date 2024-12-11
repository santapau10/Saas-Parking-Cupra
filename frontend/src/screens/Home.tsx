import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <h2>Welcome to the Home Page!</h2>
      <p>Navigate to other pages:</p>
      <nav>
        <ul>
          <li>
            <Link to="/defects">Defects</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
