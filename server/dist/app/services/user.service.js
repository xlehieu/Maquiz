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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.loginUser = exports.getUserDetail = exports.getAllUser = exports.registerUser = void 0;
const utils_1 = require("../../utils");
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const JWTService = __importStar(require("./jwt.service"));
const constants_1 = __importDefault(require("../../constants"));
var salt = bcryptjs_1.default.genSaltSync(10);
const registerUser = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password, confirmPassword, phone } = req.body;
            if (!email || !password || !confirmPassword || !phone) {
                return reject({
                    status: 'OK',
                    message: 'Thiếu dữ liệu',
                });
            }
            if (!(0, utils_1.validateEmail)(email)) {
                return reject({
                    status: 'OK',
                    message: 'Email không đúng định dạng',
                });
            }
            if (password !== confirmPassword) {
                return reject({
                    status: 'OK',
                    message: 'Mật khẩu không giống nhau',
                });
            }
            const checkEmailUser = yield user_model_1.default.findOne({
                email: email,
            });
            if (checkEmailUser) {
                return reject({
                    status: 'Error',
                    message: 'Email đã tồn tại',
                });
            }
            const hash = bcryptjs_1.default.hashSync(password, salt);
            const user = yield user_model_1.default.create({
                email,
                password: hash,
                phone,
            });
            if (user) {
                return resolve({
                    status: 'OK',
                });
            }
        }
        catch (err) {
            return reject(err);
        }
    }));
};
exports.registerUser = registerUser;
const getAllUser = () => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allUser = yield user_model_1.default.find();
            resolve(allUser);
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.getAllUser = getAllUser;
const getUserDetail = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.body.user;
            const user = yield user_model_1.default.findById(id);
            if (user) {
                const { name, email, phone, avatar, address } = user;
                return resolve({
                    message: 'Successfully fetched user',
                    data: { name, email, phone, avatar, address },
                });
            }
            return reject({
                status: 'Failure fetched user',
                message: 'Xin lỗi! Không tìm thấy dữ liệu người dùng',
            });
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.getUserDetail = getUserDetail;
const loginUser = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password)
                return reject({ message: 'Thiếu dữ liệu' });
            const userCheck = yield user_model_1.default.findOne({
                email: email,
            });
            if (!userCheck) {
                return reject({
                    message: 'Email hoặc mật khẩu không chính xác',
                });
            }
            const checkPassword = yield bcryptjs_1.default.compare(password, userCheck.password);
            if (!checkPassword) {
                return reject({
                    message: 'Email hoặc mật khẩu không chính xác',
                });
            }
            const access_token = JWTService.generalToken({
                id: userCheck.id,
                isAdmin: userCheck.isAdmin,
            });
            return resolve({
                email: userCheck === null || userCheck === void 0 ? void 0 : userCheck.email,
                message: 'Đăng nhập thành công',
                access_token: `Bearer ${access_token}`,
            });
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.loginUser = loginUser;
const updateUser = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const { id, email } = req.body.user;
            if (!(0, utils_1.validateEmail)(email)) {
                reject({
                    status: 'Error',
                    message: 'Email không hợp lệ',
                });
            }
            const checkIdUser = yield user_model_1.default.findById(id);
            if (checkIdUser) {
                const checkEmailUser = yield user_model_1.default.findOne({
                    email: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.email,
                });
                if ((checkEmailUser === null || checkEmailUser === void 0 ? void 0 : checkEmailUser.id) !== id) {
                    resolve({
                        status: 'Error',
                        message: 'Email đã tồn tại',
                    });
                }
            }
            else {
                resolve({
                    status: 'Error',
                    message: 'Không có dữ liệu người dùng',
                });
            }
            const avatar = yield (0, utils_1.uploadAndGetLink)((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.avatar, constants_1.default.uploadAvatars);
            console.log(avatar);
            const updateInfo = Object.assign(Object.assign({}, req.body), { avatar: avatar !== null && avatar !== void 0 ? avatar : checkIdUser === null || checkIdUser === void 0 ? void 0 : checkIdUser.avatar });
            yield user_model_1.default.findByIdAndUpdate(id, updateInfo);
            resolve({
                message: 'Đổi thông tin thành công',
            });
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.updateUser = updateUser;
const deleteUser = (id) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkId = yield user_model_1.default.findById(id);
            if (checkId) {
                const response = yield user_model_1.default.delete({ _id: id });
                if (response)
                    console.log(response);
                resolve({
                    message: 'Delete successfully',
                });
                reject({
                    message: 'Delete unsuccessfully',
                });
            }
            else {
                reject({
                    message: 'Lỗi! Không tìm thấy người dùng',
                });
            }
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.service.js.map