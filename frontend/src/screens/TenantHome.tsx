import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import BackgroundModal from '../components/BackgroundModal';
import ParkingCreateModal from '../components/ParkingCreateModal';
import CreateUserForm from '../components/CreateUserForm';
import { Parking } from '../types/Parking';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import ParkingList from '../components/ParkingList';
import "react-toastify/dist/ReactToastify.css";
import '../styles/TenantHome.css';
import { useNavigate } from 'react-router-dom';

const TenantHome: React.FC = () => {
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateParkingModal, setShowCreateParkingModal] = useState<boolean>(false);

  const { user, setTheme, tenant, token, apiUrl } = useUser();
  const navigate = useNavigate();

  const parseParkingData = (data: any[]): Parking[] => {
    return data.map((item) => ({
      _name: item.name ?? "",
      _address: item.address ?? "",
      _barriers: item.barriers ?? 0,
      _tenant_id: item.tenant_id ?? "",
      _capacity: item.capacity ?? 0,
      _floors: item.floors ?? 0,
      _picture: item.picture ?? "",
      _status: item.status ?? "closed",
    }));
  };

  const fetchParkings = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = `/property-management/parkings/all/${user?._tenantId}`;
      const response = await axios.get(`${apiUrl}${url}`, {
        headers: {
          "tenant_plan": tenant?._plan, 
          "Authorization": `Bearer ${token}`
        },
      });
      const parsedData = parseParkingData(response.data.parkingList);
      setParkings(parsedData);
      console.log(apiUrl)
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to load parkings.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchParkings();
  }, [user]);

  const handleParkingSubmit = async (parking: FormData) => {
    try {
      await axios.post(`${apiUrl}/property-management/parkings/${user?._tenantId}`, parking, {
        headers: {
          "Content-Type": "multipart/form-data",
          "tenant_plan": tenant?._plan, 
          "Authorization": `Bearer ${token}`
        },
      });
      toast.success("Parking created successfully!");
      await fetchParkings();
    } catch (err: any) {
      toast.error("Failed to create parking. Please try again later.");
    }
  };

  const handleParkingEdit = async (parkingName: string) => {
    try {
      await axios.post(
        `${apiUrl}/property-management/parkings/setStatus/${tenant?._tenant_id}/${parkingName}`,
        {},
        {
          headers: {
            "tenant_plan": tenant?._plan || "free",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      toast.success("Parking status toggled successfully!");
      fetchParkings();
    } catch (err: any) {
      toast.error(`Failed to toggle status of parking ${parkingName}. Please try again later.`);
    }
  };

  const handleUserSubmit = async (userData: FormData) => {
    try {
      const userObject: Record<string, any> = {};
      userData.forEach((value, key) => {userObject[key] = value;});
      await axios.post(`${apiUrl}/api-gateway/registerUser`, userObject, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });
      toast.success("User created successfully!");
    } catch (err: any) {
      toast.error("Failed to create user. Please try again later.");
    }
  };

  return (
    <div className="card">
      {user ? (
        <>
          {showBackgroundModal && (
            <BackgroundModal
              onApply={(newTheme) => {
                setShowBackgroundModal(false);
                setTheme(newTheme);
              }}
            />
          )}
          {showCreateParkingModal && (
            <ParkingCreateModal
              onClose={() => setShowCreateParkingModal(false)}
              onSubmit={handleParkingSubmit}
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
            {user._role === 'admin' && tenant?._plan == 'enterprise' &&
              <button
                className="modify-background-btn"
                onClick={() => setShowBackgroundModal(true)}
              >
                Modify Background
              </button>
            }
            {(user._role === 'admin' || "financial") &&
              <button
                className="financial-btn"
                onClick={() => navigate("/financial")}
              >
                View Financial info
              </button>
            }
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            gap: '16px',
            padding: '16px',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <ParkingList items={parkings} heading="Parking list" onEdit={handleParkingEdit} />
          </div>
          <div className="card-footer">
            {user._role === 'admin' &&
              <button
                className="create-parking-btn"
                onClick={() => setShowCreateParkingModal(true)}
              >
                Create parking
              </button>
            }
          </div>
          <div>
            {user._role === 'admin' &&
              <CreateUserForm onSubmit={handleUserSubmit} tenant_prop={user._tenantId}/>
            }
          </div>
        </>
      ) : (
        <p>There is no user currently logged in. Please log in and try again.</p>
      )}
    </div>
  );
};

export default TenantHome;
