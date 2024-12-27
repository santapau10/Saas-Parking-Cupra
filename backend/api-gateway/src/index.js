"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gateway_routes_1 = __importDefault(require("./routes/gateway.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use('/gateway', gateway_routes_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});
app.listen(PORT, () => {
    console.log(`API Gateway corriendo en a tope 🧑🏼‍💻 en ${PORT}`);
});
