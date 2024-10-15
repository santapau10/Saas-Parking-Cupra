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
      {items.length === 0 && <p>No items found :(</p>}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            style={{cursor: 'pointer'}}
            key={item.object}
            onClick={() => {
              index === selectedIndex ? setSelectedIndex(-1) : setSelectedIndex(index);
            }}
          >
            {<DefectCard {...item}></DefectCard>}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
