import { useState } from "react";
import { Defect } from "../types/Defect"; // Asegúrate de que Defect está bien definido
import DefectCard from "./DefectCard";

interface Props {
  items: Defect[]; // Asegúrate de que esta sea la forma correcta de tu tipo Defect
  heading: string;
}

function ListGroup({ items, heading }: Props) {

  return (
    <>
      <h1 style={{fontFamily: 'Arial'}}>{heading}</h1>
      {Array.isArray(items) && items.length === 0 && <p>No items found :(</p>}
      <ul className="list-group">
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item) => (
            <div key={item._object}>
              <DefectCard {...item} />
            </div>
          ))
        ) : (
          <p>No items found :(</p>
        )}
      </ul>
    </>
  );
}

export default ListGroup;
