import { useState, useEffect } from "react";
import { Parking } from "../types/Parking";
import ParkingCard from "./ParkingCard";
import "../styles/ParkingList.css"; // Asegúrate de tener el CSS necesario
import { useNavigate } from 'react-router-dom';

interface Props {
  items: Parking[];
  heading: string;
  onEdit: (parkingId: string) => void;
}

function ParkingList({ items, heading, onEdit }: Props) {

  const navigate = useNavigate();

  const handleDefectClick = (parking: Parking) => {
    navigate(`/parkings/${parking._name}`);
  };
  const handleParkingEdit = (parkingName: string) => {
    onEdit(parkingName); // Cierra el modal
  };


  useEffect(() => {
      console.log(items); // Cargar defectos al montar el componente
    }, []);

  return (
    <>
      <h1 style={{ fontFamily: "Arial", margin: 25 }}>{heading}</h1>
      {Array.isArray(items) && items.length === 0 && <p>No parkings found :(</p>}
      <ul className="list-group">
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item) => (
            <div key={item._name} onClick={() => handleDefectClick(item)}>
              <ParkingCard parking={item} onEdit={handleParkingEdit}/>
            </div>
          ))
        ) : (
          <p>No parkings found :((</p>
        )}
      </ul>
    </>
  );
}

export default ParkingList;
