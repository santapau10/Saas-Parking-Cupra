"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gateway_controller_1 = require("../controllers/gateway.controller");
const router = (0, express_1.Router)();
router.all('/:service/:tenantPrefix/:path', gateway_controller_1.handleServiceRequest);
exports.default = router;
