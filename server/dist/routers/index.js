"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_router_1 = __importDefault(require("./product.router"));
const user_router_1 = __importDefault(require("./user.router"));
const quiz_router_1 = __importDefault(require("./quiz.router"));
const classroom_router_1 = __importDefault(require("./classroom.router"));
const post_router_1 = __importDefault(require("./post.router"));
const routes = function (app) {
    app.use('/api/product', product_router_1.default);
    app.use('/api/user', user_router_1.default);
    app.use('/api/quiz', quiz_router_1.default);
    app.use('/api/classroom', classroom_router_1.default);
    app.use('/api/post', post_router_1.default);
};
exports.default = routes;
//# sourceMappingURL=index.js.map