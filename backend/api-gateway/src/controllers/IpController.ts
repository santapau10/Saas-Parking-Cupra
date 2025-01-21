import { Request, Response } from 'express';
import FirestoreService from '../services/firestore.service';

class IpController {

  private static firestore = FirestoreService.getFirestoreInstance();


  static async getIp(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.params.tenantId;
      
      // Obtener el documento de la colección 'ips' donde 'namespace' sea igual al tenantId
      const querySnapshot = await IpController.firestore.collection('ips').where('namespace', '==', tenantId).get();
      
      // Verificar si se encontró algún documento
      if (querySnapshot.empty) {
        res.status(404).json({ message: 'Tenant ID not found' });
        return;
      }

      // Obtener la IP del primer documento encontrado
      const ip = querySnapshot.docs[0].data().ip;
      
      // Enviar la respuesta con la IP
      res.status(200).json({ ip });

    } catch (error: Error | any) {
      // Manejo de errores más detallado
      res.status(500).json({ message: 'Error fetching IP', error: error.message || error });
    }
  }
}

export default IpController;
