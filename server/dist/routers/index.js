"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productRouter_js_1 = __importDefault(require("./productRouter.js"));
const userRouter_js_1 = __importDefault(require("./userRouter.js"));
const quizRouter_js_1 = __importDefault(require("./quizRouter.js"));
const routes = function (app) {
    app.use('/api/product', productRouter_js_1.default);
    app.use('/api/user', userRouter_js_1.default);
    app.use('/api/quiz', quizRouter_js_1.default);
};
exports.default = routes;
