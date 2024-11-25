import * as dotenv from 'dotenv';
dotenv.config();

export const services: { [key: string]: string } = {
  property: process.env.PROPERTY_MANAGEMENT_MS_URL!,
  parking: process.env.PARKING_MANAGEMENT_MS_URL!,
  financial: process.env.FINANCIAL_MANAGEMENT_MS_URL!,
};
