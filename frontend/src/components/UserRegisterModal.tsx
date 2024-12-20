import React from "react";
import { User } from "../types/User";

type UserModalProps = {
  username: String;
  onClose: () => void;
  onRegister: (user:User) => void;
};

const UserModal: React.FC<UserModalProps> = ({ username, onClose, onRegister }) => {
  const isLoggedIn = username !== ""

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <h2>Register</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const u = (e.target as any).username.value;
            const p = (e.target as any).password.value;
            const newUser: User = { _username: u, _password: p }; // Create User object
            onRegister(newUser);
          }}
          style={{display: "flex", flexDirection: "column", alignItems: "center"}}
        >
          <label>
            Username:
            <input type="text" name="username" required />
          </label>
          <label>
            Password:
            <input type="password" name="password" required />
          </label>
          <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
          <button type="submit" style={buttonStyle}>Register</button>
          <button type="button" onClick={onClose} style={buttonStyle}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
  height: '200%'
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