import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Entry } from "../types/Entry";
import { Payment } from "../types/Payment";
import FinancialDetailCard from "../components/FinancialDetailCard";
import { Bar } from "react-chartjs-2";
import "../styles/Financial.css";
import "react-toastify/dist/ReactToastify.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Financial: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [parkings, setParkings] = useState<string[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [monthlyEntryData, setMonthlyEntryData] = useState<any>([]);
  const [monthlyPaymentData, setMonthlyPaymentData] = useState<any>([]);

  const [selectedParking, setSelectedParking] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

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
      _timestamp: item.timestamp ?? "", // Add timestamp for grouping by month
    }));
  };

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${apiUrl}/financial-management/entriesFromTenant/${tenant?._tenant_id}`,
        {
          headers: {
            tenant_plan: tenant?._plan,
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      const response = await axios.get(
        `${apiUrl}/financial-management/paymentsFromTenant/${tenant?._tenant_id}`,
        {
          headers: {
            tenant_plan: tenant?._plan,
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      const response = await axios.get(
        `${apiUrl}/property-management/parkings/all/${user?._tenantId}`,
        {
          headers: {
            tenant_plan: tenant?._plan,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const parsedData = parseParkingData(response.data.parkingList);
      setParkings(parsedData);
    } catch (err: any) {
      setError("Failed to load parkings.");
      toast.error("Failed to load parkings.");
    } finally {
      setLoading(false);
    }
  };

  const groupEntriesByMonth = (entries: Entry[]) => {
    const months = Array(12).fill(0); // Array of 12 months initialized to 0

    entries.forEach((entry) => {
      const date = new Date(entry._timestamp);
      const month = date.getMonth();
      if (month >= 0 && month < 12) {
        months[month] += 1; // Increment the count for the respective month
      }
    });

    const res = months.map((count, index) => ({
      month: new Date(0, index).toLocaleString("en-US", { month: "short" }), // Get short month name
      entries: count,
    }));

    setMonthlyEntryData(res);
  };

  const groupPaymentsByMonth = (payments: Payment[]) => {
    const months = Array(12).fill(0); // Array of 12 months initialized to 0

    payments.forEach((payment) => {
      const date = new Date(payment._timestamp);
      const month = date.getMonth();
      if (month >= 0 && month < 12) {
        months[month] += payment._amount; // Sum the amounts for the respective month
      }
    });

    const res = months.map((amount, index) => ({
      month: new Date(0, index).toLocaleString("en-US", { month: "short" }), // Get short month name
      amount: amount,
    }));

    setMonthlyPaymentData(res);
  };

  useEffect(() => {
    if (user) {
      fetchParkings();
      fetchEntries();
      fetchPayments();
    }
  }, [user]);

  useEffect(() => {
    if (entries.length > 0) {
      groupEntriesByMonth(entries);
    }
  }, [entries]);

  useEffect(() => {
    if (payments.length > 0) {
      groupPaymentsByMonth(payments);
    }
  }, [payments]);

  const totalAmount = payments.reduce(
    (acc, payment) => acc + payment._amount,
    0
  );
  const entryCount = entries.length;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      title: {
        display: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Remove X-axis grid lines
        },
      },
      y: {
        grid: {
          display: false, // Remove Y-axis grid lines
        },
        ticks: {
          display: false, // Hide Y-axis measurements
        },
      },
    },
  };

  const entryChartData = {
    labels: monthlyEntryData.map((data: any) => data.month),
    datasets: [
      {
        label: "Entries",
        data: monthlyEntryData.map((data: any) => data.entries),
        backgroundColor: "#8884d8",
      },
    ],
  };

  const paymentChartData = {
    labels: monthlyPaymentData.map((data: any) => data.month),
    datasets: [
      {
        label: "Amount Collected (€)",
        data: monthlyPaymentData.map((data: any) => data.amount),
        backgroundColor: "#82ca9d",
      },
    ],
  };

  if (loading) return <div>Loading...</div>;
  if (!tenant)
    return (
      <div style={{ margin: 20 }}>
        Sorry, the tenant has not been correctly fetched.
      </div>
    );

  return (
    <div id="parking-financial-container">
      <h1>Financial Information Summary</h1>
      <div className="card">
        <h3>Financial Summary</h3>
        <div className="card-content-container">
          <div className="card-content">
            <p>
              <strong>Number of Entries:</strong> {entryCount}
            </p>
            <p>
              <strong>Total Amount Recollected:</strong>{" "}
              {totalAmount.toFixed(2)}€
            </p>
          </div>
          <div className="card-graph">
            <h2>Entries per Month</h2>
            {monthlyEntryData.length > 0 ? (
              <Bar
                data={entryChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { text: "Entries per Month" },
                  },
                }}
              />
            ) : (
              <p>Loading chart data...</p>
            )}
          </div>
          <div className="card-graph">
            <h2>Amount Collected per Month</h2>
            {monthlyPaymentData.length > 0 ? (
              <Bar
                data={paymentChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { text: "Amount Collected per Month" },
                  },
                }}
              />
            ) : (
              <p>Loading chart data...</p>
            )}
          </div>
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
};

export default Financial;
