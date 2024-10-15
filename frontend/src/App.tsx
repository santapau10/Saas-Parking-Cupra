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
  const [error, setError] = useState(''); // State to handle any error

  useEffect(() => {
    const fetchDefects = async () => {
      try {
        const response = await axios.get('http://localhost:3000/defects'); // Replace with your API endpoint
        setDefects(response.data); // Update the defects state with fetched data
      } catch (err: any) {
        setError(`Error: ${err.message}`); // Set the error message
      }
    };

    fetchDefects();
  }, []);

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Header/>
      {selectedIndex && <ToggableAlert onClick={() => setSelectedIndex(false)}><strong>This page is no longer available.</strong> Sorry! :(</ToggableAlert>}
      <ToastContainer/>
      <Button onClick={() => setSelectedIndex(true)} style={{ padding: 10, marginLeft: 10 }}>Click here!</Button>
      <Button onClick={() => console.log(':(')} style={{ padding: 10, marginLeft: 10, marginBottom: 50 }}>Useless button</Button>
      {!error && <ListGroup items={defects} heading="Defect list"></ListGroup>}
      {error && (<div>There was an error loading defects :( <br />{error}</div>)}
      <Footer/>
    </div>
  );
}