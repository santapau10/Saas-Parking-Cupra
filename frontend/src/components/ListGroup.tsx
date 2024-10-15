import { useState } from "react";
import { Defect } from "../types/Defect";
import DefectCard from "./DefectCard";

interface Props {
  items: Defect[];
  heading: string;
}

function ListGroup({ items, heading }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <>
      <h1>{heading}</h1>
      {Array.isArray(items) && items.length === 0 && <p>No items found :(</p>}
      <ul className="list-group">
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item, index) => (
            <li
              className={
                selectedIndex === index
                  ? "list-group-item active"
                  : "list-group-item"
              }
              style={{ cursor: "pointer" }}
              key={item.object} // Asegúrate de que object es único
              onClick={() => {
                setSelectedIndex(selectedIndex === index ? -1 : index);
              }}
            >
              <DefectCard {...item} />
            </li>
          ))
        ) : (
          <p>No items found :(</p>
        )}
      </ul>
    </>
  );
}

export default ListGroup;