

import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { PORT } from './config';
import defectsRouter from './routes/defects.routes';


const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/defects', defectsRouter);


app.listen(PORT, () => {
    console.log(`App is listening to port: ${PORT}`);
});
