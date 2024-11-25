import { Request, Response } from 'express';
import axios from 'axios';
import { services } from '../models/microservices';

export const handleServiceRequest = async (req: Request, res: Response): Promise<void> => {
  const { service, path } = req.params;
  const serviceUrl = services[service];

  if (!serviceUrl) {
    res.status(404).json({ error: `Servicio '${service}' no encontrado` });
    return;
  }

  try {
    const response = await axios({
      method: req.method,
      url: `${serviceUrl}/${path}`,
      data: req.body,
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
};
