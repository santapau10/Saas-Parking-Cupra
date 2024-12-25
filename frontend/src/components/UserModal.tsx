import React from 'react';
import { User } from '../types/User';
import GoogleSignInButton from './GoogleSignInButton';
import profile2 from '../assets/profile2.svg'

type Props = {
  user: User | null;
  onClose: () => void;
  onLogout: () => void;
  onTokenReceived: (token: string) => void;
};

const UserModal: React.FC<Props> = ({ user, onClose, onLogout, onTokenReceived }) => {
  const isLoggedIn = user != null;

  return (
    <div style={modalStyle}>
      {isLoggedIn ? (
        // Logged-in view
        <div style={contentStyle}>
          <div style={{display:'flex' , flexDirection: 'row', alignItems: 'center', padding: 20}}>
            <img height={60} width={60}
              src={user._picture}
              alt="Profile Picture"
              onError={(e) => (e.currentTarget.src = profile2)}
            />
            <h2 style={{fontSize: 20, paddingLeft: 10}}>Welcome, {user._username}!</h2>
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
}



// Basic styles for modal, content, and button
const modalStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  fontFamily: 'Arial'
};

const clickableTextStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'blue',
  textDecoration: 'underline',
  cursor: 'pointer',
  padding: 0,
  marginLeft: 10
}

const contentStyle: React.CSSProperties = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "5px",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  };  

const buttonStyle: React.CSSProperties = {
  margin: "10px",
  padding: "8px 16px",
  cursor: "pointer",
};

export default UserModal;