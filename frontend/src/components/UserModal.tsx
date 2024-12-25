import React from 'react';
import { User } from '../types/User';
import GoogleSignInButton from './GoogleSignInButton';
import profile2 from '../assets/profile2.svg';
import { useNavigate } from 'react-router-dom';

type Props = {
  user: User | null;
  onClose: () => void;
  onLogout: () => void;
  onTokenReceived: (token: string) => void;
};

const UserModal: React.FC<Props> = ({ user, onClose, onLogout, onTokenReceived }) => {
  const isLoggedIn = user != null;

  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user) {
      onClose();
      navigate('/tenanthome');
    }
  };

  return (
    <div style={modalStyle}>
      {isLoggedIn ? (
        // Logged-in view
        <div style={contentStyle}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 20 }}>
            <button onClick={handleProfileClick} style={profileButtonStyle}>
              <img
                height={60}
                width={60}
                src={user._picture}
                alt="Profile Picture"
                onError={(e) => (e.currentTarget.src = profile2)}
                style={profileImgStyle}
              />
            </button>
            <h2 style={{ fontSize: 20, paddingLeft: 10 }}>Welcome, {user._username}!</h2>
          </div>
          <button onClick={onLogout} style={buttonStyle}>Log Out</button>
          <button onClick={onClose} style={buttonStyle}>Close</button>
        </div>
      ) : (
        <div style={contentStyle}>
          <h2>Login</h2>
          <GoogleSignInButton onTokenReceived={onTokenReceived} />
          <button type="button" onClick={onClose} style={buttonStyle}>Close</button>
        </div>
      )}
    </div>
  );
};

// Basic styles for modal, content, and button
const modalStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  fontFamily: 'Arial',
};

const contentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '5px',
  textAlign: 'center',
  maxWidth: '400px',
  width: '100%',
};

const buttonStyle: React.CSSProperties = {
  margin: '10px',
  padding: '8px 16px',
  cursor: 'pointer',
};

const profileButtonStyle: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  padding: 0,
};

const profileImgStyle: React.CSSProperties = {
  width: '60px',
  height: '60px',
  borderRadius: '50%', /* Circular */
  objectFit: 'cover', /* Ensure the image covers the circle */
  border: '2px solid #ddd', /* Optional border */
};

export default UserModal;
