import React, { useState, ChangeEvent, FormEvent } from "react";
import "../styles/CreateUserForm.css";

interface FormProps {
  onSubmit: (data: FormData) => void;
  tenant_prop: string;
}

const CreateUserForm: React.FC<FormProps> = ({ onSubmit, tenant_prop }) => {
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    tenant_id: tenant_prop,
    email: "",
    role: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", newUser.username);
    formData.append("password", newUser.password);
    formData.append("tenant_id", newUser.tenant_id);
    formData.append("email", newUser.email);
    formData.append("role", newUser.role);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2 className="formTitle">Create a New User</h2> {/* Title added here */}
      <div className="formGroup">
        <label htmlFor="username" className="label">
          Username:
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={newUser.username}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div className="formGroup">
        <label htmlFor="password" className="label">
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={newUser.password}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div className="formGroup">
        <label htmlFor="email" className="label">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={newUser.email}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div className="formGroup">
        <label htmlFor="role" className="label">
          Role:
        </label>
        <select
          id="role"
          name="role"
          value={newUser.role}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="" style={{ color: "grey" }}>
            Please select an option...
          </option>
          <option value="financial">Financial</option>
          <option value="property manager">Property Manager</option>
        </select>
      </div>
      <button type="submit" className="button">
        Submit
      </button>
    </form>
  );
};

export default CreateUserForm;
