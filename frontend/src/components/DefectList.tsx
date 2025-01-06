import { useState } from "react";
import { Defect } from "../types/Defect";
import DefectCard from "./DefectCard";
import DefectDetail from "./DefectDetail";
import "../styles/DefectList.css"; // Asegúrate de tener el CSS necesario

interface Props {
  items: Defect[];
  heading: string;
  onDelete: (defectId: string) => void;
}

function DefectList({ items, heading, onDelete }: Props) {
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);

  const handleDefectClick = (defect: Defect) => {
    setSelectedDefect(defect); // Abre el modal con el defecto seleccionado
  };

  const handleCloseModal = () => {
    setSelectedDefect(null); // Cierra el modal
  };
  const handleDefectDelete = (defectId: string) => {
    onDelete(defectId); // Cierra el modal
  };

  return (
    <>
      <h1 style={{ fontFamily: "Arial", margin: 25 }}>{heading}</h1>
      {Array.isArray(items) && items.length === 0 && <p>No defects found :(</p>}
      <ul className="list-group">
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item) => (
            <div key={item._object} onClick={() => handleDefectClick(item)}>
              <DefectCard defect={{...item}} onDelete={(defectId) => handleDefectDelete(defectId)} />
            </div>
          ))
        ) : (
          <p>No items found :(</p>
        )}
      </ul>

      {/* Modal que aparece cuando se selecciona un defecto */}
      {selectedDefect && (
        <DefectDetail defect={selectedDefect} onClose={handleCloseModal} />
      )}
    </>
  );
}

export default DefectList;
