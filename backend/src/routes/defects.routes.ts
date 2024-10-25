import { Router, Request, Response, NextFunction } from 'express';
import { Defect } from '../models/defect.model';
import multer from 'multer';
import FirestoreService from '../services/firestore.service';

const router = Router();
const firestore = FirestoreService.getFirestoreInstance();

// Middleware para manejar errores asíncronos
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Ruta para obtener todos los defectos
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const snapshot = await firestore.collection('defects').get();
  if (snapshot.empty) {
    return res.status(200).json("No hay defectos.");
  }

  const defects = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  res.status(200).json(defects);
}));

// Ruta para obtener defectos filtrados por estado
router.get('/filteredByStatus/:status', asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.params;
  const snapshot = await firestore.collection('defects').where('status', '==', status).get();
  if (snapshot.empty) {
    return res.status(200).json("No hay defectos con ese estado.");
  }

  const defects = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  res.status(200).json(defects);
}));

// Ruta para obtener defectos filtrados por ubicación
router.get('/filteredByLocation/:location', asyncHandler(async (req: Request, res: Response) => {
  const { location } = req.params;
  const snapshot = await firestore.collection('defects').where('location', '==', location).get();
  if (snapshot.empty) {
    return res.status(200).json("No hay defectos en esa ubicación.");
  }

  const defects = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  res.status(200).json(defects);
}));

// Ruta para obtener un defecto por ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const doc = await firestore.collection('defects').doc(id).get();
  if (!doc.exists) {
    return res.status(404).json({ message: 'Defecto no encontrado' });
  }

  res.status(200).json({ id: doc.id, ...doc.data() });
}));
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/',
  upload.single('_image'),
  asyncHandler(async (req: Request, res: Response) => {
    const {
      _object,
      _location,
      _description,
      _detailedDescription,
      _reportingDate,
      _status,
    } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo.' });
    }
    const imageBuffer = req.file.buffer;
    const imageName = `defects/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    
    // Sube la imagen al bucket y obtén la URL pública
    const imageUrl = await FirestoreService.uploadFile(imageBuffer, imageName, 'image/jpeg');

    // Crea el nuevo documento con la URL de la imagen en lugar del archivo
    const newDefect = {
      object: _object,
      location: _location,
      description: _description,
      detailedDescription: _detailedDescription,
      reportingDate: new Date(_reportingDate),
      status: _status,
      image: imageUrl, // URL de la imagen en lugar del archivo
    };

    // Guarda el documento en Firestore
    const docRef = await FirestoreService.getFirestoreInstance().collection('defects').add(newDefect);

    // Devuelve la respuesta con el ID del documento y los datos guardados
    res.status(201).json({ id: docRef.id, ...newDefect });
  })
);

// Ruta para actualizar un defecto por ID
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { object, location, description, detailedDescription, reportingDate, status, image } = req.body;

  const defectData = {
    object,
    location,
    description,
    detailedDescription,
    reportingDate: new Date(reportingDate),
    status,
    image
  };

  const docRef = firestore.collection('defects').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return res.status(404).json({ message: 'Defecto no encontrado' });
  }

  await docRef.update(defectData);

  res.status(200).json({ id: docRef.id, ...defectData });
}));

// Ruta para eliminar un defecto por ID
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const docRef = firestore.collection('defects').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return res.status(404).json({ message: 'Defecto no encontrado' });
  }

  await docRef.delete();

  res.status(204).json({ message: "Defecto eliminado" });
}));

export default router;
