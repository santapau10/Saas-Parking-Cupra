

import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import defectsRouter from './routes/defects.routes';
import usersRouter from './routes/auth.route'
import * as dotenv from 'dotenv';
dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());



app.use('/financial-management/defects', defectsRouter);
app.use('/financial-management/users', usersRouter)

// Ruta /health para verificar el estado del servidor
app.get('/financial-management/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

app.listen(process.env.PORT, () => {
    console.log(`El parking esta activado 🚀`);
});
