import { Request, Response } from 'express';
import FirestoreService from '../services/firestore.service';

class IpController {

  private static firestore = FirestoreService.getFirestoreInstance();


  static async getIp(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.params.tenantId;
      const plan = req.params.plan;
      if(plan=="enterprise"){
        const querySnapshot = await IpController.firestore.collection('ips').where('namespace', '==', tenantId).get();
        if (querySnapshot.empty) {
          res.status(404).json({ message: 'Tenant ID not found' });
          return;
        }
  
        const ip = querySnapshot.docs[0].data().ip;
        res.status(200).json({ ip });
      }else {
        const querySnapshot = await IpController.firestore.collection('ips').where('namespace', '==', plan).get();
        if (querySnapshot.empty) {
          res.status(404).json({ message: 'Tenant ID not found' });
          return;
        }
  
        const ip = querySnapshot.docs[0].data().ip;
        res.status(200).json({ ip });
      }
    } catch (error: Error | any) {
      // Manejo de errores más detallado
      res.status(500).json({ message: 'Error fetching IP', error: error.message || error });
    }
  }
}

export default IpController;
