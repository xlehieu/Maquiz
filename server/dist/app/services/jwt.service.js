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
exports.refreshTokenService = exports.generalRefreshToken = exports.generalToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generalToken = (payload) => {
    const token = jsonwebtoken_1.default.sign(Object.assign({}, payload), process.env.ACCESS_TOKEN, { expiresIn: '12h' });
    return token;
};
exports.generalToken = generalToken;
const generalRefreshToken = (payload) => {
    const refresh_token = jsonwebtoken_1.default.sign(Object.assign({}, payload), process.env.REFRESH_TOKEN, { expiresIn: '365d' });
    return refresh_token;
};
exports.generalRefreshToken = generalRefreshToken;
const refreshTokenService = (token) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    resolve({
                        status: 'ERROR',
                        message: 'Lỗi định danh',
                    });
                }
                const access_token = yield (0, exports.generalToken)({
                    id: user === null || user === void 0 ? void 0 : user.id,
                    isAdmin: user === null || user === void 0 ? void 0 : user.isAdmin,
                });
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    access_token,
                });
            }));
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.refreshTokenService = refreshTokenService;
//# sourceMappingURL=jwt.service.js.map