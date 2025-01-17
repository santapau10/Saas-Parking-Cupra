// controllers/DefectController.ts
import { Request, Response } from 'express';
import FinancialRepositoryFactory from '../repositories/FinancialRepositoryFactory';

const financialRepository = FinancialRepositoryFactory.createRepository();

class FinancialController {
  static async getEntriesFromParking(req: Request, res: Response): Promise<void> {
    const { parking } = req.params;
    const tenant_id = req.params.tenant_id as string;
    const tenant_plan = req.headers.tenant_plan as string;
    const entries = await financialRepository.getEntriesFromParking(tenant_id, tenant_plan, parking);
    res.status(200).json(entries);
  }
  static async getEntriesFromTenant(req: Request, res: Response): Promise<void> {
    const tenant_id = req.params.tenant_id as string;
    const tenant_plan = req.headers.tenant_plan as string;
    const entries = await financialRepository.getEntriesFromTenant(tenant_id, tenant_plan);
    res.status(200).json(entries);
  }
  static async getPaymentsFromParking(req: Request, res: Response): Promise<void> {
    const { parking } = req.params;
    const tenant_id = req.params.tenant_id as string;
    const tenant_plan = req.headers.tenant_plan as string;
    const entries = await financialRepository.getPaymentsFromParking(tenant_id, tenant_plan, parking);
    res.status(200).json(entries);
  }
  static async getPaymentsFromTenant(req: Request, res: Response): Promise<void> {
    const tenant_id = req.params.tenant_id as string;
    const tenant_plan = req.headers.tenant_plan as string;
    const entries = await financialRepository.getPaymentsFromTenant(tenant_id, tenant_plan);
    res.status(200).json(entries);
  }


}

export default FinancialController;
