

import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import defectsRouter from './routes/defects.routes';
import usersRouter from './routes/auth.route'
import parkingsRouter from './routes/parkings.route'
import * as dotenv from 'dotenv';
dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());



app.use('/defects', defectsRouter);
app.use('/users', usersRouter)
app.use('/parkings', parkingsRouter)

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

app.listen(process.env.PORT, () => {
    console.log(`El service de property esta activado 🚀`);
});
