
import { Request, Response } from 'express';
import FirestoreService from '../services/firestore.service';

class IpController {

  private static firestore = FirestoreService.getFirestoreInstance();

  static async getIp(req: Request, res: Response): Promise<void> {
    try {

        const tenantId = req.params.tenantId;
        const tenant = await this.firestore.collection('tenants').where("tenantId", "==", tenantId).get();
        if (tenant.empty) {
            res.status(404).json({ message: 'Tenant not found' });
            return;
        }
        const doc = await this.firestore.collection('gateway').where("plan", "==", tenant.docs[0].data().plan).get();
        const ip = doc.docs[0].data().ip;
        res.status(200).json({ ip });
    } catch (error) {
      res.status(500).json({ message: 'Api not found', error: error });
    }
  }
}

export default IpController;
