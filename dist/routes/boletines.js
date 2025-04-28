"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getboletin_controller_1 = require("../controllers/getboletin.controller");
const router = (0, express_1.Router)();
router.get('/:boletinID', getboletin_controller_1.getBoletinById);
exports.default = router;
