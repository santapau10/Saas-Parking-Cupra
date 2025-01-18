import React, { useState, useEffect } from 'react';
import '../styles/LandingCard.css';
import { Entry } from '../types/Entry';
import { Payment } from '../types/Payment';
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';
import { useUser } from '../context/UserContext';
import "react-toastify/dist/ReactToastify.css";


interface LandingCardProps {
  parkingName: string
}

const ParkingFinancialDetailCard: React.FC<LandingCardProps> = ({ parkingName }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  const { tenant, token } = useUser();

  const parseEntries = (data: any[]): Entry[] => {
    return data.map((item) => ({
      _licensePlate: item.licensePlate ?? "",
      _parkingName: item.parking_id ?? "",
      _timestamp: item.timestamp ?? "",
      _type: item.type ?? ""
    }));
  };

  const parsePayments = (data: any[]): Payment[] => {
    return data.map((item) => ({
      _licensePlate: item.licensePlate ?? "",
      _amount: item.amount ?? 0,  // Assuming amount is a number
      _parkingName: item.parkingId ?? ""
    }));
  };

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${apiUrl}/financial-management/entriesFromParking/${tenant?._tenant_id}/${parkingName}`, {
        headers: {
          "tenant_plan": tenant?._plan,
          "Authorization": `Bearer ${token}`
        },
      });
      const parsedEntries = parseEntries(response.data);
      setEntries(parsedEntries);
    } catch (err: any) {
      setError("Failed to load entries. Please try again later.");
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${apiUrl}/financial-management/paymentsFromParking/${tenant?._tenant_id}/${parkingName}`, {
        headers: {
          "tenant_plan": tenant?._plan,
          "Authorization": `Bearer ${token}`
        },
      });
      const parsedPayments = parsePayments(response.data);
      setPayments(parsedPayments);
    } catch (err: any) {
      setError("Failed to load payments. Please try again later.");
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch entries and payments when parkingName is available
  useEffect(() => {
    if (parkingName) {
      fetchEntries();
      fetchPayments();
    }
  }, [parkingName]);

  // Calculate the total amount from payments
  const totalAmount = payments.reduce((acc, payment) => acc + payment._amount, 0);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="card">
      <ToastContainer />
      <h3>Financial Information for {parkingName}</h3>
      {error && <div className="error">{error}</div>}

      <div className="card-content">
        <div>
          <p><strong>Number of Entries:</strong> {entries.length}</p>
        </div>
        <div>
          <p><strong>Total Amount Recollected:</strong> ${totalAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ParkingFinancialDetailCard;
