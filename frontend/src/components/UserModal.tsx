import React, { useState } from 'react';
import { User } from '../types/User';
import profile2 from '../assets/profile2.svg';
import { useNavigate } from 'react-router-dom';

type Props = {
  user: User | null;
  onClose: () => void;
  onLogout: () => void;
  onLogin: (email: string, password: string, tenantId: string) => void;
};

const UserModal: React.FC<Props> = ({ user, onClose, onLogout, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState('');

  const isLoggedIn = user != null;
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user) {
      onClose();
      navigate('/tenanthome');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password, tenantId);
    setEmail('');
    setPassword('');
    setTenantId('');
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
        // Login form view
        <div style={contentStyle}>
          <h2>Login</h2>
          <form onSubmit={handleSubmit} style={formStyle}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Tenant ID"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              required
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>Login</button>
          </form>
          <button type="button" onClick={onClose} style={buttonStyle}>Close</button>
        </div>
      )}
    </div>
  );
};

// Basic styles for modal, content, and form elements
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

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const inputStyle: React.CSSProperties = {
  margin: '10px 0',
  padding: '8px',
  width: '100%',
  maxWidth: '300px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

export default UserModal;
