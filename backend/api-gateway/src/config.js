"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GCP_KEYS_ROUTE = exports.FRONTEND_URL = exports.PORT = void 0;
// src/config.ts
exports.PORT = process.env.PORT || 3000;
exports.FRONTEND_URL = process.env.FRONTEND_URL || '0.0.0.0';
exports.GCP_KEYS_ROUTE = process.env.GCP_KEYS_ROUTE;
