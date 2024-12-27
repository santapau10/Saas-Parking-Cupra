"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleServiceRequest = void 0;
const axios_1 = __importDefault(require("axios"));
const microservices_1 = require("../models/microservices");
const handleServiceRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { tenantPrefix, service, path } = req.params;
    const serviceUrl = microservices_1.services[service];
    if (!serviceUrl) {
        res.status(404).json({ error: `Servicio '${service}' no encontrado` });
        return;
    }
    try {
        const response = yield (0, axios_1.default)({
            method: req.method,
            url: `${serviceUrl}/${tenantPrefix}/${path}`,
            data: req.body,
        });
        res.status(response.status).json(response.data);
    }
    catch (error) {
        res.status(((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500).json({
            error: error.message,
            details: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
        });
    }
});
exports.handleServiceRequest = handleServiceRequest;
