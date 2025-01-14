import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Parking } from '../types/Parking';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ParkingList from '../components/ParkingList';
import { User } from '../types/User';

const HomePage: React.FC = () => {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

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
      var url = "/property-management/parkings/all";
      const localUser = localStorage.getItem('user');
      if (localUser) {
        const user: User = JSON.parse(localUser)
        url = `/property-management/parkings/all/${user._tenantId}`;
      }
      const response = await axios.get(`${apiUrl}${url}`);
      const parsedData = parseParkingData(response.data.parkingList);
      setParkings(parsedData);
    } catch (err: any) {
      setError("Failed to load parkings. Please try again later.");
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkings(); // Cargar defectos al montar el componente
  }, [localStorage]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <ToastContainer />
        <div style={{display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '16px',
          justifyContent: 'center',
          alignItems:'center'}}>

          <ParkingList items={parkings} heading="Parking list" />  
        </div>
    </div>
  );
};

export default HomePage;
