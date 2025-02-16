import React, { useEffect, useState } from 'react';
import { Parking } from '../types/Parking';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ParkingList from '../components/ParkingList';
import { useUser } from '../context/UserContext';
import LandingCard from '../components/LandingCard';
import { Tenant } from '../types/Tenant';

const HomePage: React.FC = () => {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, tenant, token, apiUrl } = useUser();

  const parseParkingData = (data: any[]): Parking[] => {
    return data.map((item) => ({
      _name: item.name ?? '',
      _address: item.address ?? '',
      _barriers: item.barriers ?? 0,
      _tenant_id: item.tenant_id ?? '',
      _capacity: item.capacity ?? 0,
      _floors: item.floors ?? 0,
      _picture: item.picture ?? '',
      _status: item.status ?? 'closed',
    }));
  };

  const fetchParkings = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTenant = localStorage.getItem('tenant')
        if (fetchedTenant) {
        const parsedFetchedTenant : Tenant = JSON.parse(fetchedTenant)
        const response = await axios.get(`${apiUrl}/property-management/parkings/all/${parsedFetchedTenant._tenant_id}`,{
            headers: {
              'tenant_plan': parsedFetchedTenant._plan,
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const parsedData = parseParkingData(response.data.parkingList);
        setParkings(parsedData);
        } else {
          const response = await axios.get(`${apiUrl}/property-management/parkings/all`);
          const parsedData = parseParkingData(response.data.parkingList);
          setParkings(parsedData);
        }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load parkings.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      console.log(apiUrl);
    }
  };

  useEffect(() => {
      fetchParkings();
  }, [user]);


  const handleParkingEdit = async (parkingName: string) => {
    try {
      await axios.post(`${apiUrl}/property-management/parkings/setStatus/${tenant?._tenant_id}/${parkingName}`,{},{
          headers: {
            'tenant_plan': tenant?._plan || 'free',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      toast.success('Parking status toggled successfully!');
      fetchParkings();
    } catch (err: any) {
      toast.error(
        `Failed to toggle status of parking ${parkingName}. Please try again later.`
      );
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LandingCard
          onSubmit={async (formData) => {
            try {
              const tenantObject: Record<string, any> = {};
              formData.forEach((value, key) => {
                tenantObject[key] = value;
              });
              console.log(tenantObject);
              await axios.post(`${apiUrl}/api-gateway/registerTenant`, tenantObject);
              toast.success('Tenant created successfully!');
            } catch {
              toast.error('Failed to create tenant. Please try again later.');
            }
          }}
        />
      </div>
      {loading ? (
    <div style={{display:'flex' , justifyContent: 'center'}}><p>Loading parkings...</p></div>
      ) : (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '16px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ParkingList items={parkings} heading="Parking List" onEdit={handleParkingEdit} />
      </div>
      )}
    </div>
  );
};

export default HomePage;
