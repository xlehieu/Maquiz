"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.deleteUser = exports.updateUser = exports.loginUser = exports.registerUser = exports.refreshToken = exports.getUserDetail = exports.getAllUser = void 0;
const userService = __importStar(require("../services/user.service"));
const JWTService = __importStar(require("../services/jwt.service"));
const mongoose_1 = require("mongoose");
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield userService.getAllUser();
        return res.status(200).json(response);
    }
    catch (err) {
        return res.status(500).json({
            message: err,
        });
    }
});
exports.getAllUser = getAllUser;
const getUserDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield userService.getUserDetail(req);
        return res.status(200).json(response);
    }
    catch (err) {
        return res.status(500).json({
            status: 'ERROR',
            message: err,
        });
    }
});
exports.getUserDetail = getUserDetail;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
        if (!token) {
            return res.status(200).json({
                status: 'ERROR',
                message: 'Token bị lỗi',
            });
        }
        const response = yield JWTService.refreshTokenService(token);
        return res.status(200).json(response);
    }
    catch (err) {
        return res.status(500).json({
            status: 'ERROR',
            message: err,
        });
    }
});
exports.refreshToken = refreshToken;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield userService.registerUser(req);
        req.session.access_token = response.access_token;
        res.cookie('user_email', response.email, {
            httpOnly: false, // có thể truy cập cookie từ JavaScript (bảo mật)
            maxAge: 1000 * 60 * 60 * 24, // Cookie hết hạn sau 1 ngày
            sameSite: 'strict', // Ngăn chặn các cuộc tấn công CSRF
        });
        return res.status(200).json(response);
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield userService.loginUser(req);
        req.session.access_token = response.access_token;
        res.cookie('user_email', response.email, {
            httpOnly: false, // có thể truy cập cookie từ JavaScript (bảo mật)
            maxAge: 1000 * 60 * 60 * 24, // Cookie hết hạn sau 1 ngày
            sameSite: 'strict', // Ngăn chặn các cuộc tấn công CSRF
        });
        return res.status(200).json({ message: 'Đăng nhập thành công' });
    }
    catch (err) {
        return res.status(401).json(err);
    }
});
exports.loginUser = loginUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield userService.updateUser(req);
        return res.status(200).json(response);
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = new mongoose_1.Types.ObjectId(req.params.id);
        if (!id) {
            return res.status(200).json({
                status: 'OK',
                message: 'Xin lỗi quý khách, chúng tôi đang bị lỗi',
            });
        }
        const response = yield userService.deleteUser(id);
        return res.status(200).json(response);
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.deleteUser = deleteUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Xóa session
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ status: 'error', message: 'Failed to logout' });
            }
            // Xóa cookie liên quan nếu có
            res.clearCookie('connect.sid'); // Thay 'connect.sid' bằng tên cookie bạn sử dụng
            return res.status(200).json({ status: 'OK', message: 'Log out success' });
        });
    }
    catch (err) {
        return res.status(500).json(err);
    }
});
exports.logoutUser = logoutUser;
//# sourceMappingURL=user.controller.js.map