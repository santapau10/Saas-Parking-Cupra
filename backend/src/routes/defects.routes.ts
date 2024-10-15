// src/routes/defects.ts

import { Router, Request, Response } from 'express';
import { Defect } from '../models/defect.model';

const router = Router();


const defects: Defect[] = [];


router.get('/', (req: Request, res: Response) => {
switch (defects.length) {
    case 0:
        res.status(201).json("No hay");
        break;

    default:
        res.status(201).json(defects);
        break;
}
});
router.get('/filteredByStatus/:status', (req: Request, res: Response) => {
    const { status } = req.params;
    const filteredDefects = defects.filter(defect => defect.status === status);
    
    if (filteredDefects.length === 0) {
        res.status(200).json("No hay defectos con ese estado");
    } else {
        res.status(200).json(filteredDefects);
    }
});
router.get('/filteredByLocation/:location', (req: Request, res: Response) => {
    const { location } = req.params;
    const filteredDefects = defects.filter(defect => defect.location === location);
    
    if (filteredDefects.length === 0) {
        res.status(200).json("No hay defectos con ese estado");
    } else {
        res.status(200).json(filteredDefects);
    }
});


router.get('/:id', (req: Request, res: Response) => {
  const defect = defects.find(d => d.object === req.params.id);
  if (defect) {
    res.json(defect);
  } else {
    res.status(404).json({ message: 'Defecto no encontrado' });
  }
});

router.post('/', (req: Request, res: Response) => {
  const { object, location, description, detailedDescription, reportingDate, status } = req.body;

  const newDefect = new Defect(object, location, description, detailedDescription, new Date(reportingDate), status);
  defects.push(newDefect);
  
  res.status(201).json(newDefect);
});

router.put('/:id', (req: Request, res: Response) => {
  const index = defects.findIndex(d => d.object === req.params.id); 
  if (index !== -1) {
    const { object, location, description, detailDescription, reportingDate, status } = req.body;
    
    const updatedDefect = new Defect(
      object,
      location,
      description,
      detailDescription,
      new Date(reportingDate),
      status
    );
    
    defects[index] = updatedDefect; 
    res.json(updatedDefect);
  } else {
    res.status(404).json({ message: 'Defecto no encontrado' });
  }
});


router.delete('/:id', (req: Request, res: Response) => {
  const index = defects.findIndex(d => d.object === req.params.id);
  if (index !== -1) {
    defects.splice(index, 1); 
    res.status(204).json({message: "Defecto eliminado"});
  } else {
    res.status(404).json({ message: 'Defecto no encontrado' });
  }
});

export default router;
