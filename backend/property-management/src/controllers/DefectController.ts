// controllers/DefectController.ts
import { Request, Response } from 'express';
import FirestoreDefectRepository from '../repositories/FirestoreDefectRepository';
import FirestoreService from '../services/firestore.service';

const defectRepository = new FirestoreDefectRepository();

class DefectController {
  static async getAll(req: Request, res: Response): Promise<void> {
    const defects = await defectRepository.getAll();
    res.status(200).json(defects);
  }

  static async getByStatus(req: Request, res: Response): Promise<void> {
    const { status } = req.params;
    const defects = await defectRepository.getByStatus(status);
    res.status(200).json(defects);
  }

  static async getByLocation(req: Request, res: Response): Promise<void> {
    const { location } = req.params;
    const defects = await defectRepository.getByLocation(location);
    res.status(200).json(defects);
  }

  static async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const defect = await defectRepository.getById(id);
    if (!defect) {
      res.status(404).json({ message: 'Defecto no encontrado' });
      return;
    }
    res.status(200).json(defect);
  }

  static async create(req: Request, res: Response): Promise<void> {
    const { _object, _location, _description, _detailedDescription, _reportingDate, _status, _username } = req.body;

    const imageUrl = req.file
      ? await FirestoreService.uploadFile(req.file.buffer, `defects/${Date.now()}.jpg`, 'image/jpeg')
      : null;

    const newDefect = { _object, _location, _description, _detailedDescription, _reportingDate: new Date(_reportingDate), _status, _image: imageUrl, _username };

    const defectId = await defectRepository.create(newDefect);
    res.status(201).json({ id: defectId, ...newDefect });
  }

  static async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const defectData = req.body;
    await defectRepository.update(id, defectData);
    res.status(200).json({ id, ...defectData });
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await defectRepository.delete(id);
    res.status(204).json({ message: 'Defecto eliminado' });
  }
}

export default DefectController;
