"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.frontEndAppAuthenticateMiddleware = exports.authUserMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//dùng để check admin
const authMiddleware = (req, res, next) => {
    var _a;
    if (!req.session.access_token)
        return;
    const token = (_a = req.session.access_token) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    //hàm verify này nhận dối số thứ 2 là khóa để giải mã
    // ở hàm general token bên jwtservice cũng là khóa process.env.access_token nên nó giải mã được
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Lỗi',
            });
        }
        if (!user.isAdmin) {
            return res.status(403).json({
                status: 'ERROR',
                message: 'Authentication error',
            });
        }
        next();
    });
};
exports.authMiddleware = authMiddleware;
//dùng để check người dùng
const authUserMiddleware = (req, res, next) => {
    var _a;
    if (!req.session.access_token)
        return res.status(401).json(); //.json({ status: 'ERR', message: 'Bạn cần đăng nhập' });
    const token = (_a = req.session.access_token) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    //hàm verify này nhận dối số thứ 2 là khóa để giải mã
    // ở hàm general token bên jwtservice cũng là khóa process.env.access_token nên nó giải mã được
    if (!process.env.ACCESS_TOKEN) {
        return res.status(500); //.json({ status: 'ERR', message: 'Lỗi' });
    }
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                status: 'ERROR',
                message: 'Lỗi',
            });
        }
        const currentTime = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại tính theo giây
        if (user.exp && user.exp < currentTime) {
            return res.status(401).json({
                status: 'ERROR',
                message: 'Token expired',
            });
        }
        if (user && 'id' in user) {
            if (!(user === null || user === void 0 ? void 0 : user.id)) {
                return res.status(401).json({
                    status: 'ERROR',
                    message: 'Authentication error',
                });
            }
        }
        req.body.user = user;
        next();
    });
};
exports.authUserMiddleware = authUserMiddleware;
const frontEndAppAuthenticateMiddleware = (req, res, next) => {
    var _a;
    if (!req.session.access_token)
        return res.json(); //.json({ status: 'ERR', message: 'Bạn cần đăng nhập' });
    const token = (_a = req.session.access_token) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    //hàm verify này nhận dối số thứ 2 là khóa để giải mã
    // ở hàm general token bên jwtservice cũng là khóa process.env.access_token nên nó giải mã được
    if (!process.env.ACCESS_TOKEN) {
        return res.status(500); //.json({ status: 'ERR', message: 'Lỗi' });
    }
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                status: 'ERROR',
                message: 'Lỗi',
            });
        }
        const currentTime = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại tính theo giây
        if (user.exp && user.exp < currentTime) {
            return res.status(401).json({
                status: 'ERROR',
                message: 'Token expired',
            });
        }
        if (user && 'id' in user) {
            if (!(user === null || user === void 0 ? void 0 : user.id)) {
                return res.status(401).json({
                    status: 'ERROR',
                    message: 'Authentication error',
                });
            }
        }
        req.body.user = user;
        next();
    });
};
exports.frontEndAppAuthenticateMiddleware = frontEndAppAuthenticateMiddleware;
//# sourceMappingURL=auth.middleware.js.map