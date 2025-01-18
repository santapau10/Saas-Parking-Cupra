// controllers/AuthController.ts

import { Request, Response } from 'express';
import FirestoreParkingRepository from '../repositories/FirestoreParkingRepository';
import { Parking } from '../models/parking.model';
import FirestoreService from '../services/firestore.service';
import Payment from '../models/payment.model';
import { EntryOrExit } from '../models/entry.model';
import { PubSub } from '@google-cloud/pubsub';


const parkingRepository = new FirestoreParkingRepository();

class ParkingController {
  static async getParkingCapacity(req: Request, res: Response): Promise<void> {
    try {
      const parkingId = req.params.parkingId;
      // const parking = await parkingRepository.getParkingById(parkingId);
      res.status(200).json({ /* capacity: parking.capacity */ });
    } catch (error) {
      res.status(500).json({ message: 'Fetching failed', error: error });
    }
  }
    static async registerEntry(req: Request, res: Response): Promise<void> {
        try {
          const entry = new EntryOrExit(req.body.license_plate, req.body.parking_id, new Date().toISOString(), 'entry');
          const tenant_id = req.headers['tenant_id'] as string;
          const tenant_plan = req.headers['tenant_plan'] as string;
          const parking = await parkingRepository.getParkingById(tenant_id, tenant_plan, entry.parking_id);
          if (parking.status === 'closed') {
              res.status(400).json({ message: 'Parking is closed' });
              return;
          }
          if (parking.capacity <= 0) {
              res.status(400).json({ message: 'Parking is full' });
              return;
          }
          // await parkingRepository.updateParkingCapacity(entry.parking_id, parking.capacity - 1);
          await parkingRepository.addEntry(entry, tenant_id, tenant_plan);
          res.status(200).json({ message: 'Entry registered successfully' });
        } catch (error) {
          res.status(500).json({ message: 'Entry registration failed', error: error });
        }
    }
    static async registerExit(req: Request, res: Response): Promise<void> {
        try {
          const exit = new EntryOrExit(req.body.license_plate, req.body.parking_id, new Date().toISOString(), 'exit');
          const tenant_id = req.headers['tenant_id'] as string;
          const tenant_plan = req.headers['tenant_plan'] as string;
          const parking = await parkingRepository.getParkingById(tenant_id, tenant_plan,exit.parking_id);
          // if (parking.capacity >= parking.capacity) {
          //     res.status(400).json({ message: 'Parking is empty' });
          //     return;
          // }
          // await parkingRepository.updateParkingCapacity(exit.parking_id, parking.capacity + 1);
          await parkingRepository.addExit(exit ,tenant_id, tenant_plan);
          res.status(200).json({ message: 'Exit registered successfully' });
        } catch (error) {
        res.status(500).json({ message: 'Exit registration failed', error: error });
        }
    }
    static async registerPayment(req: Request, res: Response): Promise<void> {
      try {
        const { license_plate, parkingId, rate } = req.body;

        if (!license_plate || !parkingId || !rate) {
          res.status(400).json({ message: 'Missing required fields' });
          return;
        }
        const tenant_id = req.headers['tenant_id'] as string;
        const tenant_plan = req.headers['tenant_plan'] as string;
        const entry = await parkingRepository.findEntryByLicensePlate(license_plate, tenant_id, tenant_plan);

        if (!entry) {
          res.status(404).json({ message: 'Entry not found for the provided license plate' });
          return;
        }

        // Calcular la diferencia de tiempo en horas
        const entryTime = new Date(entry.timestamp);
        const currentTime = new Date();
        const diffInHours = Math.ceil((currentTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60));

        // Calcular el monto basado en la tarifa
        const amount = diffInHours * rate;
       
        // Registrar el pago
        const payment = new Payment(parkingId, amount, license_plate);
        await parkingRepository.registerPayment(payment, tenant_id, tenant_plan);

        res.status(200).json({ message: 'Payment registered successfully', amount });
      } catch (error) {
        console.error('Error registering payment:', error);
        res.status(500).json({ message: 'Payment registration failed', error: error });
      }
    }

  static async getById(req: Request, res: Response): Promise<void> {
    const { parkingId } = req.params;
    const tenant_id = req.headers['tenant_id'] as string;
    const tenant_plan = req.headers['tenant_plan'] as string;
    const parking = await parkingRepository.getParkingById(tenant_id, tenant_plan,parkingId);
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
      const tenant_id = req.headers['tenant_id'] as string;
      const tenant_plan = req.headers['tenant_plan'] as string;
      if (isNaN(newCapacity) || newCapacity < 0) {
        res.status(400).send({ error: 'Invalid capacity value' });
        return;
      }
      const parking = await parkingRepository.getParkingById(tenant_id, tenant_plan,parkingId);

      await parkingRepository.updateParkingCapacity(parkingId, newCapacity);

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
