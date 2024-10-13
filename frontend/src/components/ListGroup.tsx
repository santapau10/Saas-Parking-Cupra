import { useState } from "react";

interface Props {
  items: string[];
  heading: string;
  onSelectItem?: (item: string) => void;
}

function ListGroup({ items, heading, onSelectItem }: Props) {
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
            key={item}
            onClick={() => {
              index === selectedIndex ? setSelectedIndex(-1) : setSelectedIndex(index);
              onSelectItem?.(item)
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
