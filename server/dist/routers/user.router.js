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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController = __importStar(require("../app/controllers/user.controller"));
const auth_middleware_1 = require("../app/middlewares/auth.middleware");
const router = express_1.default.Router();
// const upload = multer({ imageDB: multer.memoryStorage() }); // lưu ảnh tạm thời vào bộ nhớ tạm thời, sau khi up ảnh xong thì xóa (delete req.file)
router.put('/update', auth_middleware_1.authUserMiddleware, UserController.updateUser);
router.post('/sign-in', UserController.loginUser);
router.post('/sign-up', UserController.registerUser);
router.post('/log-out', UserController.logoutUser);
router.post('/refresh-token', UserController.refreshToken);
router.delete('/delete/:id', auth_middleware_1.authMiddleware, UserController.deleteUser);
router.get('/detail', auth_middleware_1.authUserMiddleware, UserController.getUserDetail);
router.get('/', auth_middleware_1.authMiddleware, UserController.getAllUser);
exports.default = router;
//# sourceMappingURL=user.router.js.map