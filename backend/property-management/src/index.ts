

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



app.use('/property-management/defects', defectsRouter);
app.use('/property-management/users', usersRouter)
app.use('/property-management/parkings', parkingsRouter)

app.get('/property-management/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

app.listen(process.env.PORT, () => {
    console.log(`El service de property esta activado 🚀`);
});
