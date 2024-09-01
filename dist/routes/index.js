"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = __importDefault(require("./upload"));
const status_1 = __importDefault(require("./status"));
const router = (0, express_1.Router)();
router.use('/upload', upload_1.default);
router.use('/status', status_1.default);
exports.default = router;
