// controllers/AuthController.ts

import { Request, Response } from 'express';
import FirestoreParkingRepository from '../repositories/FirestoreParkingRepository';
import { Parking } from '../models/parking.model';
import FirestoreService from '../services/firestore.service';


const parkingRespository = new FirestoreParkingRepository();

class ParkingController {
  static async getAllParkings(req: Request, res: Response): Promise<void> {
    try {
      const parkingList = await parkingRespository.getAll()
      res.status(201).json({ message: 'Fetching Successfully', parkingList });
    } catch (error) {
      res.status(500).json({ message: 'Fetching failed', error: error });
    }
  }
  static async getAllParkingsFromTenant(req: Request, res: Response): Promise<void> {
    try {
      const {tenant_id} = req.params;
      const parkingList = await parkingRespository.getAllFromTenant(tenant_id)
      res.status(201).json({ message: 'Fetching Successfully', parkingList });
    } catch (error) {
      res.status(500).json({ message: 'Fetching failed', error: error });
    }
  }
  static async createParking(req: Request, res: Response): Promise<void> {
    try {
      const { name, location, barriers, capacity, floors } = req.body;
      const tenant_id = req.params.tenant_id;

      // Subir la imagen si existe
      const pictureUrl = req.file
        ? await FirestoreService.uploadFile(req.file.buffer, `parkings/${Date.now()}.jpg`, req.file.mimetype)
        : null;

      // Crear instancia de Parking
      const newParking = new Parking(
        name,
        location,
        barriers,
        tenant_id,
        capacity,
        floors,
        pictureUrl!, // URL de la imagen subida
        'closed'
      );

      // Guardar el parking en el repositorio
      const parking = await parkingRespository.createParking(newParking);

      // Respuesta exitosa
      res.status(201).json({ message: 'Parking created successfully', parking });
    } catch (error) {
      // Manejo de errores
      res.status(500).json({ message: 'Parking creation failed', error: error });
    }
  }
  static async getById(req: Request, res: Response): Promise<void> {
    const { parkingId } = req.params;
    const parking = await parkingRespository.getParkingById(parkingId);
    if (!parking) {
      res.status(404).json({ message: 'parkingo no encontrado' });
      return;
    }
    res.status(200).json(parking);
  }
  static async getByName(req: Request, res: Response): Promise<void> {
    const { parkingName } = req.params;
    const parking = await parkingRespository.getParkingByName(parkingName);
    if (!parking) {
      res.status(404).json({ message: 'parkingo no encontrado' });
      return;
    }
    res.status(200).json(parking);
  }

  static async setCapacity(req: Request, res: Response): Promise<void> {
    try {
      const parkingId = req.params.parking;
      const newCapacity = parseInt(req.body.capacity, 10);

      if (isNaN(newCapacity) || newCapacity < 0) {
        res.status(400).send({ error: 'Invalid capacity value' });
        return;
      }
      const parking = await parkingRespository.getParkingById(parkingId);

      await parkingRespository.updateParkingCapacity(parkingId, newCapacity);

      res.status(200).send({
        message: `Capacity updated successfully`,
        parkingId,
        oldCapacity: parking.capacity,
        newCapacity,
      });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error });
    }
  }
  static async setBarriers(req: Request, res: Response): Promise<void> {
    try {
      const parkingId = req.params.parking;
      const newBarriers = parseInt(req.body.capacity, 10);

      if (isNaN(newBarriers) || newBarriers < 0) {
        res.status(400).send({ error: 'Invalid barriers value' });
        return;
      }

      await parkingRespository.updateParkingBarriers(parkingId, newBarriers);

      res.status(200).send({
        message: `Barriers updated successfully`,
        parkingId,
        newBarriers,
      });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error });
    }
  }
  static async setStatus(req: Request, res: Response): Promise<void> {
    try {
      const parkingId = req.params.parking;

      const parking = await parkingRespository.getParkingById(parkingId);

      const status = await parkingRespository.updateParkingStatus(parkingId, parking.status);

      res.status(200).send({
        message: `Capacity updated successfully`,
        parkingId,
        status
      });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error });
    }
  }
}

export default ParkingController;
