import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
dotenv.config();
import financial from './routes/financial.router'

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


app.use('/financial-management', financial);

// Ruta /health para verificar el estado del servidor
app.get('/financial-management/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

app.listen(process.env.PORT, () => {
    console.log(`El servicio de financial esta activado 🚀`);
});
