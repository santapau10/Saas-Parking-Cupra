import Button from "./components/Button";
import ToggableAlert from "./components/ToggableAlert";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ListGroup from "./components/ListGroup";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(false);
  const [defects, setDefects] = useState([])
  const [loading, setLoading] = useState(true); // State to handle the loading state
  const [error, setError] = useState(''); // State to handle any error

  useEffect(() => {
    const fetchDefects = async () => {
      try {
        const response = await axios.get('http://localhost:3000/defects'); // Replace with your API endpoint
        setDefects(response.data); // Update the defects state with fetched data
      } catch (err: any) {
        setError(`Error: ${err.message}`); // Set the error message
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchDefects(); // Call the fetch function
  }, []); // Empty dependency array ensures the fetch runs once when the component mounts

  // Conditionally render based on the loading, error, and defects states
  if (loading) return <p>Loading defects...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Header/>
      {selectedIndex && <ToggableAlert onClick={() => setSelectedIndex(false)}><strong>This page is no longer available.</strong> Sorry! :(</ToggableAlert>}
      <ToastContainer/>
      <Button onClick={() => setSelectedIndex(true)} style={{ padding: 10, marginLeft: 10 }}>Click here!</Button>
      <Button onClick={() => console.log(':(')} style={{ padding: 10, marginLeft: 10, marginBottom: 50 }}>Useless button</Button>
      <ListGroup items={defects} heading="Defect list"></ListGroup>
      <Footer/>
    </div>
  );
}