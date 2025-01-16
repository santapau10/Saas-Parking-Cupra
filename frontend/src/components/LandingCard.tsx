import React, { useState } from 'react';
import '../styles/LandingCard.css';

interface LandingCardProps {
  onSubmit: (data: FormData) => void;
}

const LandingCard: React.FC<LandingCardProps> = ({ onSubmit }) => {
  const [newTenant, setNewTenant] = useState({
    name: '',
    email: '',
    password: '',
    plan: 'free',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTenant({...newTenant,[name]: value,});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newTenant.name);
    formData.append("password", newTenant.password);
    formData.append("email", newTenant.email);
    formData.append("plan", newTenant.plan);
    onSubmit(formData);
  };

  return (
    <div className="landing-card-container">
      <div className="cards-container">
        <div className="insidecard">
          <h2 className="insidecard-title">Free</h2>
          <p className="insidecard-price">0€/month</p>
          <ul className="insidecard-features">
            <li className="feature">Shared collection in database</li>
            <li className="feature">Shared bucket</li>
            <li className="feature">Microservices in shared namespace</li>
            <li className="feature">No customization features</li>
          </ul>
        </div>
        <div className="insidecard">
          <h2 className="insidecard-title">Standard</h2>
          <p className="insidecard-price">15€/month</p>
          <ul className="insidecard-features">
            <li className="feature">Separated shared collection in database</li>
            <li className="feature">Separated shared bucket</li>
            <li className="feature">Microservices in separated shared namespace</li>
            <li className="feature">Customizable picture</li>
          </ul>
        </div>
        <div className="insidecard">
          <h2 className="insidecard-title">Enterprise</h2>
          <p className="insidecard-price">49€/month</p>
          <ul className="insidecard-features">
            <li className="feature">Dedicated collection in database</li>
            <li className="feature">Dedicated bucket</li>
            <li className="feature">Microservices in dedicated namespace</li>
            <li className="feature">Customizable picture & background</li>
          </ul>
        </div>
      </div>

      <form className="tenant-form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          name="name"
          placeholder="Name"
          value={newTenant.name}
          onChange={handleChange}
          required
        />
        <input
          className="input"
          type="email"
          name="email"
          placeholder="Email Address"
          value={newTenant.email}
          onChange={handleChange}
          required
        />
        <input
          className="input"
          type="password"
          name="password"
          placeholder="Password"
          value={newTenant.password}
          onChange={handleChange}
          required
        />
        <select
          className="select"
          name="plan"
          value={newTenant.plan}
          onChange={handleChange}
          required
        >
          <option value="free">Free</option>
          <option value="standard">Standard</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <button className="submit-button" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default LandingCard;
