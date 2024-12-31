import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import BackgroundModal from '../components/BackgroundModal';
import '../styles/TenantHome.css';

const TenantHome: React.FC = () => {
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);

  const {user, setUser, tenant} = useUser(); // Access the user data from the context

  if (!user) {
    return <div>There is no user currently logged in. Please log in and try again</div>;
  }

  return (
    <div className="card">
      {showBackgroundModal && (
        <BackgroundModal
          onApply={(updatedUser) => {
            setShowBackgroundModal(false);
            setUser(updatedUser);
          }}
        />
      )}
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
            <p><strong>Role:</strong> {user._role}</p>
          </div>
        </div>
      </div>
      <div className="card-footer">
        {user._role == 'admin' && tenant?._plan == 'enterprise' &&<button
          className="modify-background-btn"
          onClick={() => setShowBackgroundModal(true)}
        >
          Modify Background
        </button>}
      </div>
    </div>
  );
};

export default TenantHome;
