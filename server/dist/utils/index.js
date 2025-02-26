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
exports.validateEmail = exports.uploadAndGetLink = void 0;
exports.generateUniqueRandomString = generateUniqueRandomString;
const config_1 = require("../firebase/config");
const storage_1 = require("firebase/storage");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function generateUniqueRandomString(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
//Chuyển đổi ảnh copy chat GPT: khi lưu ảnh vào firebase thì cần phải chuyển thành dạng blob (Binary Large Object)
function dataURItoBlob(base64Image) {
    var byteString = atob(base64Image.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
}
const uploadAndGetLink = (imageData, folderName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!folderName || imageData.length <= 0) {
            return undefined;
        }
        if (imageData.startsWith('http'))
            return imageData;
        const blob = dataURItoBlob(imageData);
        const storageRef = (0, storage_1.ref)(config_1.imageDB, `${folderName}/${generateUniqueRandomString(19)}`);
        const data = yield (0, storage_1.uploadBytesResumable)(storageRef, blob);
        const url = yield (0, storage_1.getDownloadURL)(data.ref);
        return url;
    }
    catch (err) {
        return null;
    }
});
exports.uploadAndGetLink = uploadAndGetLink;
const validateEmail = (email) => {
    return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};
exports.validateEmail = validateEmail;
//# sourceMappingURL=index.js.map