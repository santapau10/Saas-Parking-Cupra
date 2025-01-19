import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Entry } from "../types/Entry";
import { Payment } from "../types/Payment";
import FinancialDetailCard from "../components/FinancialDetailCard";
import "../styles/Financial.css"


import "react-toastify/dist/ReactToastify.css";

const Financial: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [parkings, setParkings] = useState<string[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedParking, setSelectedParking] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const apiUrl2 = "http://localhost:3001";
  
  const { user, tenant, token } = useUser();

  const parseEntries = (data: any[]): Entry[] => {
    return data.map((item) => ({
      _licensePlate: item.licensePlate ?? "",
      _parkingName: item.parking_id ?? "",
      _timestamp: item.timestamp ?? "",
      _type: item.type ?? "",
    }));
  };

  const parsePayments = (data: any[]): Payment[] => {
    return data.map((item) => ({
      _licensePlate: item.licensePlate ?? "",
      _amount: item.amount ?? 0,
      _parkingName: item.parkingId ?? "",
    }));
  };

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${apiUrl}/financial-management/entriesFromTenant/${tenant?._tenant_id}`, {
        headers: {
          "tenant_plan": tenant?._plan,
          "Authorization": `Bearer ${token}`,
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
      const response = await axios.get(`${apiUrl}/financial-management/paymentsFromTenant/${tenant?._tenant_id}`, {
        headers: {
          "tenant_plan": tenant?._plan,
          "Authorization": `Bearer ${token}`,
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

  const parseParkingData = (data: any[]): string[] => {
    return data.map((item) => item.name ?? "");
  };

  const fetchParkings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${apiUrl}/property-management/parkings/all/${user?._tenantId}`, {
        headers: {
          tenant_plan: tenant?._plan,
          Authorization: `Bearer ${token}`,
        },
      });
      const parsedData = parseParkingData(response.data.parkingList);
      setParkings(parsedData);
    } catch (err: any) {
      setError("Failed to load parkings.");
      toast.error("Failed to load parkings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchParkings();
      fetchEntries();
      fetchPayments();
    }
  }, [user]);

  const totalAmount = payments.reduce((acc, payment) => acc + payment._amount, 0);
  const entryCount = entries.length;

  if (loading) return <div>Loading...</div>;
  if (!tenant) return <div style={{ margin: 20 }}>Sorry, the tenant has not been correctly fetched.</div>;

  return (
    <div id="parking-financial-container">
      <h1>Financial Information Summary</h1>
      
      <div className="card">
        <h3>Financial Summary</h3>
        <div className="card-content">
          <p>
            <strong>Number of Entries:</strong> {entryCount}
          </p>
          <p>
            <strong>Total Amount Recollected:</strong> {totalAmount.toFixed(2)}€
          </p>
        </div>
      </div>
      <div>
        <label htmlFor="parking-select">Select a Parking:</label>
        <select
          id="parking-select"
          value={selectedParking || ""}
          onChange={(e) => setSelectedParking(e.target.value)}
        >
          <option value="" disabled>
            -- Select a Parking --
          </option>
          {parkings.map((parking, index) => (
            <option key={index} value={parking}>
              {parking}
            </option>
          ))}
        </select>
      </div>
      {selectedParking && <FinancialDetailCard parkingName={selectedParking} />}
    </div>
  );
}  

export default Financial;
