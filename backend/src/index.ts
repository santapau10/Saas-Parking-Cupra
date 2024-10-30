

import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import defectsRouter from './routes/defects.routes';
import * as dotenv from 'dotenv';
dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());



app.use('/defects', defectsRouter);


app.listen(process.env.PORT, () => {
    console.log(`El parking esta activado 🚀`);
});
