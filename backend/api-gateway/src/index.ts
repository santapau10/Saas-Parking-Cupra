import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import auth from './routes/gateway.routes'

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api-gateway', auth);

app.get('/api-gateway/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});
app.listen(PORT, () => { 
  console.log(`API Gateway corriendo en a tope 🧑🏼‍💻 en ${PORT}`);
});
