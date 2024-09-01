"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/', (req, res) => {
    console.log('Webhook received:', req.body);
    res.status(200).send('Webhook processed');
});
exports.default = router;
