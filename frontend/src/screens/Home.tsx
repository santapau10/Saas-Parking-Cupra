import React, { useEffect, useState } from 'react';
import { Parking } from '../types/Parking';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ParkingList from '../components/ParkingList';
import { User } from '../types/User';
import LandingCard from '../components/LandingCard';
import { useUser } from '../context/UserContext';

const HomePage: React.FC = () => {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  // const apiUrl = "http://localhost:3001"
  const { tenant, token } = useUser();

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
  
      const localUser = localStorage.getItem('user');
      if (localUser) {
        const user: User = JSON.parse(localUser);
        // Wait for token to be available
        if (!token) {
          console.log("Waiting for token to be available...");
          return;
        }
        console.log("Token available!");
        const response = await axios.get(`${apiUrl}/property-management/parkings/all/${user._tenantId}`, {
          headers: {
            "tenant_plan": tenant?._plan,
            "Authorization": `Bearer ${token}`,
          },
        });
        const parsedData = parseParkingData(response.data.parkingList);
        setParkings(parsedData);
      } else {
        const response = await axios.get(`${apiUrl}/property-management/parkings/all/`);
        const parsedData = parseParkingData(response.data.parkingList);
        setParkings(parsedData);
      }
    } catch (err: any) {
      setError("Failed to load parkings. Please try again later.");
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Watch for token and ensure `fetchParkings` only runs when token is available
  useEffect(() => {
    if (localStorage.getItem("user")) {
      if (token) {
        fetchParkings();
      } else {
        console.log("Token not available yet. Waiting...");
      }
    } else {
      fetchParkings();
    }
  }, [token]);
  

  const handleTenantSubmit = async (tenantData: FormData) => {
    try {
      const tenantObject: Record<string, any> = {};
      tenantData.forEach((value, key) => {tenantObject[key] = value;});
      await axios.post(`${apiUrl}/api-gateway/registerTenant`, tenantObject, {
        headers: {
          "tenant_plan": tenant?._plan, 
          "Authorization": `Bearer ${token}`
        },
      });
      toast.success("Tenant created successfully!");
    } catch (err: any) {
      toast.error("Failed to create Tenant. Please try again later.");
    }
  };

  const handleParkingEdit = async (parkingName: string) => {
    try {
      await axios.post(`${apiUrl}/property-management/parkings/setStatus/${tenant?._tenant_id}/${parkingName}`, {
        headers: {
          "tenant_plan": tenant?._plan,
          "Authorization": `Bearer ${token}`
        },
      });
      toast.success("Parking status toggled successfully!");
      await fetchParkings();
    } catch (err: any) {
      toast.error(`Failed to toggle status of parking ${parkingName}. Please try again later.`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <ToastContainer />
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <LandingCard onSubmit={handleTenantSubmit}/>
      </div>
      <div style={{display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        gap: '16px',
        padding: '16px',
        justifyContent: 'center',
        alignItems:'center'}}>

        <ParkingList items={parkings} heading="Parking list" onEdit={handleParkingEdit} />  
      </div>
    </div>
  );
};

export default HomePage;
