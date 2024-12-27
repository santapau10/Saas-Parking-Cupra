import { Request, Response } from 'express';
import { admin } from '../services/firestore.service';

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "No se proporcionó un token válido." });
    return;
  }

  const token = authorizationHeader.split(" ")[1];
  const firestore = admin.firestore();

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    const tenantIdFromToken = decodedToken.tenant_id;
    if (!tenantIdFromToken) {
      res.status(400).json({ error: "El token no contiene un tenant_id válido." });
      return;
    }

    const { parkingId } = req.body; 
    if (!parkingId) {
      res.status(400).json({ error: "No se proporcionó un parkingId válido en el cuerpo de la solicitud." });
      return;
    }

    const parkingDoc = await firestore.collection('parkings').doc(parkingId).get();

    if (!parkingDoc.exists) {
      res.status(404).json({ error: "No se encontró el parking especificado." });
      return;
    }

    const parkingData = parkingDoc.data();
    if (parkingData?.tenant_id !== tenantIdFromToken) {
      res.status(403).json({ error: "El tenant_id del token no coincide con el del parking." });
      return;
    }
    res.status(200).json({ message: "Autorización válida.", uid: decodedToken.uid, tenant_id: tenantIdFromToken });
  } catch (error) {
    console.error("Error al verificar el token o consultar Firestore:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};
