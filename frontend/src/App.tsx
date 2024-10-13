import Alert from "./components/Alert";
import Button from "./components/Button";
import ToggableAlert from "./components/ToggableAlert";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ListGroup from "./components/ListGroup";
import { useState } from "react";

function App() {
  const [selectedIndex, setSelectedIndex] = useState(false);

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Header/>
      {selectedIndex && <ToggableAlert onClick={() => setSelectedIndex(false)}><strong>This page is no longer available.</strong> Sorry! :(</ToggableAlert>}
      <Button onClick={() => setSelectedIndex(true)} style={{ padding: 10, marginLeft: 10 }}>Click here!</Button>
      <Button onClick={() => console.log(':(')} style={{ padding: 10, marginLeft: 10, marginBottom: 50 }}>Useless button</Button>
      <ListGroup items={['Defect 1', 'Defect 2', 'Defect 3', 'Defect 4', 'Defect 5', 'Defect 6']} heading="Defect list" onSelectItem={(item) => console.log(item + " clicked") }></ListGroup>
      <Footer/>
    </div>
  );
}

export default App;
