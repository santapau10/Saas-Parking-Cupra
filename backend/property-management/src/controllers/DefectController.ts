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

  static async getFromParking(req: Request, res: Response): Promise<void> {
    const { parking } = req.params;
    const tenant_id = req.params.tenant_id as string;
    const tenant_plan = await defectRepository.getTenantPlan(tenant_id);
    const defects = await defectRepository.getFromParking(tenant_id, tenant_plan, parking);
    res.status(200).json(defects);
  }

  static async getByStatus(req: Request, res: Response): Promise<void> {
    const { status } = req.params;
    const parking = req.params.parking as string;
    const tenant_id = req.headers['tenant_id'] as string;
    const tenant_plan = await defectRepository.getTenantPlan(tenant_id);

    const defects = await defectRepository.getByStatus(tenant_id, tenant_plan, parking, status);
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
    const { parking, description, detailedDescription, reportingDate, status, username } = req.body;
    const tenant_id = req.params.tenant_id as string;
    const tenant_plan = await defectRepository.getTenantPlan(tenant_id);
    const imageUrl = req.file
      ? await FirestoreService.uploadFile(req.file.buffer, `${tenant_plan}/${tenant_id}/defects/${Date.now()}.jpg`, 'image/jpeg')
      : null;

    const newDefect = { parking, description, detailedDescription, reportingDate: new Date(reportingDate), status, image: imageUrl, username };
    const defectId = await defectRepository.create(tenant_id, tenant_plan, newDefect);
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
