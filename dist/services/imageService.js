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
exports.processImages = void 0;
const sharp_1 = __importDefault(require("sharp"));
const axios_1 = __importDefault(require("axios"));
const Product_1 = __importDefault(require("../models/Product"));
const Request_1 = __importDefault(require("../models/Request"));
const uuid_1 = require("uuid");
const processImages = (products, requestId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Request_1.default.updateOne({ requestId }, { status: 'processing' });
        for (const product of products) {
            const outputUrls = [];
            for (const url of product.inputImageUrls) {
                const response = yield axios_1.default.get(url, { responseType: 'arraybuffer' });
                const compressedImage = yield (0, sharp_1.default)(response.data)
                    .jpeg({ quality: 50 })
                    .toBuffer();
                const outputUrl = `https://some-cloud-storage/${(0, uuid_1.v4)()}.jpg`; //to be Implemented actual upload to cloud storage
                outputUrls.push(outputUrl);
            }
            yield Product_1.default.updateOne({ _id: product._id }, { outputImageUrls: outputUrls, status: 'completed' });
        }
        yield Request_1.default.updateOne({ requestId }, { status: 'completed' });
        triggerWebhook(requestId);
    }
    catch (error) {
        console.error('Error processing images:', error);
    }
});
exports.processImages = processImages;
const triggerWebhook = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield axios_1.default.post('https://webhook-url', { requestId, status: 'completed' });
    }
    catch (error) {
        console.error('Error triggering webhook:', error);
    }
});
