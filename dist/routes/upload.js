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
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const uuid_1 = require("uuid");
const Product_1 = __importDefault(require("../models/Product"));
const Request_1 = __importDefault(require("../models/Request"));
const imageService_1 = require("../services/imageService");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
router.post('/', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const requestId = (0, uuid_1.v4)();
        const products = [];
        const request = new Request_1.default({ requestId, status: 'pending' });
        yield request.save();
        ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) && require('fs').createReadStream(req.file.path)
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => {
            const product = new Product_1.default({
                requestId,
                productName: data['Product Name'],
                inputImageUrls: data['Input Image Urls'].split(',').map((url) => url.trim()),
                status: 'pending',
            });
            products.push(product);
        })
            .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            yield Product_1.default.insertMany(products);
            (0, imageService_1.processImages)(products, requestId);
            res.status(200).json({ requestId });
        }));
    }
    catch (error) {
        res.status(500).json({ message: 'Error processing the file', error });
    }
}));
exports.default = router;
