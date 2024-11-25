import express, { Application } from 'express';
import gatewayRoutes from './routes/gateway.routes'

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.use('/gateway', gatewayRoutes);

app.listen(PORT, () => {
  console.log(`API Gateway corriendo en a tope 🧑🏼‍💻 en ${PORT}`);
});
