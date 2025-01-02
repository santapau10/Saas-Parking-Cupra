

import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import parkingRouter from './routes/parking.route';
import * as dotenv from 'dotenv';
dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());



app.use('/parking-management/parking', parkingRouter);
// Ruta /health para verificar el estado del servidor
app.get('/parking-management/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});


app.listen(process.env.PORT, () => {
    console.log(`El servicio de parking esta activado 🚀`);
});
