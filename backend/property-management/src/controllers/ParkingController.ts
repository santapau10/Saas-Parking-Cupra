// controllers/AuthController.ts

import { Request, Response } from 'express';
import FirestoreParkingRepository from '../repositories/FirestoreParkingRepository';
import { Parking } from '../models/parking.model';


const parkingRespository = new FirestoreParkingRepository();

class ParkingController {
  static async getAllParkingsFromTenant(req: Request, res: Response): Promise<void> {
    try {
      const {tenant_id} = req.params;
      const parkingList = await parkingRespository.getAll(tenant_id)
      res.status(201).json({ message: 'Fetching Successfully', parkingList });
    } catch (error) {
      res.status(500).json({ message: 'Fetching failed', error: error });
    }
  }
  static async createParking(req: Request, res: Response): Promise<void> {
    try {
      const newParking = new Parking(req.body.name, req.body.location, req.body.barriers, req.body.tenant_id, req.body.capacity, req.body.floors, req.body.picture);
      const parking = await parkingRespository.createParking(newParking);
      res.status(201).json({ message: 'User registered successfully', parking });
    } catch (error) {
      res.status(500).json({ message: 'Registration failed', error: error });
    }
  }
  static async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const parking = await parkingRespository.getParkingById(id);
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
      const parking = await parkingRespository.getParkingById(parkingId);

      await parkingRespository.updateParkingBarriers(parkingId, newBarriers);

      res.status(200).send({
        message: `Barriers updated successfully`,
        parkingId,
        oldBarriesr: parking.barriers,
        newBarriers,
      });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error });
    }
  }
}

export default ParkingController;
