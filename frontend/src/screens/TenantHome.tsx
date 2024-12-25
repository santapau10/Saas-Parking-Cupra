import React from 'react';
import { useUser } from '../context/UserContext';
import '../styles/TenantHome.css';

const TenantHome: React.FC = () => {
  const user = useUser(); // Access the user data from the context

  if (!user) {
    return <div>Loading user...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Welcome, {user._username}!</h2>
      </div>
      <div className="card-body">
        <div className="user-info">
          <div className="user-picture">
            <img src={user._picture} alt="User Profile" className="profile-img" />
          </div>
          <div className="info">
            <p><strong>Email:</strong> {user._email}</p>
            <p><strong>Theme:</strong> {user._theme}</p>
            <p><strong>Tenancy Type:</strong> {user._tenancyType}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantHome;
