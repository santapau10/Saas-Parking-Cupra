// controllers/AuthController.ts

import { Request, Response } from 'express';
import FirestoreParkingRepository from '../repositories/FirestoreParkingRepository';
import { Parking } from '../models/parking.model';
import FirestoreService from '../services/firestore.service';
import Payment from '../models/payment.model';


const parkingRespository = new FirestoreParkingRepository();

class ParkingController {
  static async getParkingCapacity(req: Request, res: Response): Promise<void> {
    try {
      const parkingId = req.params.parkingId;
      const parking = await parkingRespository.getParkingById(parkingId);
      res.status(200).json({ capacity: parking.capacity });
    } catch (error) {
      res.status(500).json({ message: 'Fetching failed', error: error });
    }
  }
    static async registerEntry(req: Request, res: Response): Promise<void> {
        try {
        const parkingId = req.body.parkingId;
        const parking = await parkingRespository.getParkingById(parkingId);
        if (parking.status === 'closed') {
            res.status(400).json({ message: 'Parking is closed' });
            return;
        }
        if (parking.capacity <= 0) {
            res.status(400).json({ message: 'Parking is full' });
            return;
        }
        await parkingRespository.updateParkingCapacity(parkingId, parking.capacity - 1);
        res.status(200).json({ message: 'Entry registered successfully' });
        } catch (error) {
        res.status(500).json({ message: 'Entry registration failed', error: error });
        }
    }
    static async registerExit(req: Request, res: Response): Promise<void> {
        try {
        const parkingId = req.body.parkingId;
        const parking = await parkingRespository.getParkingById(parkingId);
        if (parking.capacity >= parking.capacity) {
            res.status(400).json({ message: 'Parking is empty' });
            return;
        }
        await parkingRespository.updateParkingCapacity(parkingId, parking.capacity + 1);
        res.status(200).json({ message: 'Exit registered successfully' });
        } catch (error) {
        res.status(500).json({ message: 'Exit registration failed', error: error });
        }
    }
    static async registerPayment(req: Request, res: Response): Promise<void> {
        try {
        const payment = new Payment(req.body.parkingId, req.body.amount);
        const parking = await parkingRespository.registerPayment(payment);

        res.status(200).json({ message: 'Payment registered successfully' });
        } catch (error) {
        res.status(500).json({ message: 'Payment registration failed', error: error });
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
}

export default ParkingController;
