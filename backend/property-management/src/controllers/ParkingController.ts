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
}

export default ParkingController;
