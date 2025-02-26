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
exports.enrollInClassroom = exports.getClassroomDetail = exports.createClassroom = exports.getUserClassrooms = void 0;
const classroom_model_1 = __importDefault(require("../models/classroom.model"));
const mongoose_1 = __importStar(require("mongoose"));
const user_model_1 = __importDefault(require("@models/user.model"));
const utils_1 = require("~/src/utils");
const constants_1 = require("~/src/constants");
const getUserClassrooms = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { user } = req.body;
            const findUser = yield user_model_1.default.findById(user.id);
            if (!findUser)
                return reject({ message: 'Không tìm thấy người dùng' });
            const teacherId = (user === null || user === void 0 ? void 0 : user.id) && mongoose_1.Types.ObjectId.isValid(user.id) ? user.id : new mongoose_1.Types.ObjectId(user.id);
            const myClassrooms = yield classroom_model_1.default.find({ teacher: teacherId })
                .select(['name', 'classCode', 'thumb'])
                .populate('teacher', 'name avatar');
            //toán tử in, tìm các phần tử trong dánh sách, như trên là tìm _id của Classroom nào có trong enrolledClassrooms
            const enrolledClassrooms = yield classroom_model_1.default.find({
                _id: {
                    $in: findUser.enrolledClassrooms,
                },
            })
                .select(['name', 'classCode', 'thumb']) // chỉ lấy trường name, classCode, thumb của classroom
                .populate('teacher', 'name avatar'); // ref đến bảng teacher và lấy name và avatar của teacher
            //nếu muốn bỏ id thì chỉ cần thêm -id vào là ok
            return resolve({
                message: 'successfully fetched',
                data: {
                    myClassrooms,
                    enrolledClassrooms,
                },
            });
        }
        catch (err) {
            console.log(err);
            reject({ message: 'Lỗi', error: err });
        }
    }));
};
exports.getUserClassrooms = getUserClassrooms;
const createClassroom = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, subject, user } = req.body;
            console.log('req body', req.body);
            if (!(name === null || name === void 0 ? void 0 : name.trim()) || !(subject === null || subject === void 0 ? void 0 : subject.trim())) {
                if (!mongoose_1.default.Types.ObjectId.isValid(user === null || user === void 0 ? void 0 : user.id)) {
                    return reject({ message: 'Không tìm thấy người dùng' });
                }
                return reject({ message: 'Thiếu dữ liệu' });
            }
            const teacher = yield user_model_1.default.findById(new mongoose_1.Types.ObjectId(user === null || user === void 0 ? void 0 : user.id));
            if (!teacher)
                return reject({ message: 'Không tìm thấy giáo viên' });
            //tạo lớp class code
            let classCode = (0, utils_1.generateUniqueRandomString)(6);
            console.log(classCode);
            let classCodeExists = yield mongoose_1.default.models.classroom.exists({ classCode });
            // kiểm tra xem có trùng không?
            while (classCodeExists) {
                classCode = (0, utils_1.generateUniqueRandomString)(6);
                classCodeExists = yield mongoose_1.default.models.classroom.exists({ classCode });
            }
            classCode = classCode;
            const thumb = constants_1.imageClassThumbnailDefault[Math.floor(Math.random() * constants_1.imageClassThumbnailDefault.length)];
            const classroom = yield classroom_model_1.default.create({ name, subject, teacher: user.id, thumb, classCode });
            console.log(classroom);
            teacher.myClassrooms.push(classroom.id);
            yield teacher.save();
            if (classroom) {
                resolve({ message: 'successfully created classroom', data: classroom });
            }
        }
        catch (err) {
            reject({ message: 'Lỗi', error: err });
        }
    }));
};
exports.createClassroom = createClassroom;
const getClassroomDetail = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { classCode } = req.query;
            if (typeof classCode === 'string' && !(classCode === null || classCode === void 0 ? void 0 : classCode.trim())) {
                return reject({ status: 400, message: 'Thiếu dữ liệu' });
            }
            const classroomDetail = yield classroom_model_1.default.findOne({ classCode: classCode }).select('-_id');
            if (!classroomDetail)
                return reject({ status: 400, message: 'Không tìm thấy dữ liệu lớp học' });
            const students = yield user_model_1.default.find({
                _id: {
                    $in: classroomDetail === null || classroomDetail === void 0 ? void 0 : classroomDetail.students,
                },
            }).select(['-_id', 'name', 'avatar']);
            const teacher = yield user_model_1.default.find({
                _id: {
                    $in: classroomDetail.teacher,
                },
            }).select(['-_id', 'name', 'avatar']);
            console.log(students);
            const data = Object.assign(classroomDetail, { students }, { teacher });
            return resolve({ message: 'Successfully fetched classroom', data: data });
        }
        catch (err) {
            return reject({ message: 'ERROR', error: err });
        }
    }));
};
exports.getClassroomDetail = getClassroomDetail;
const enrollInClassroom = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { classCode, user } = req.body;
            const userId = (user === null || user === void 0 ? void 0 : user.id) && mongoose_1.Types.ObjectId.isValid(user.id) ? user.id : null;
            const findUser = yield user_model_1.default.findById(userId);
            if (!classCode || !findUser) {
                return reject({ status: 400, message: 'Thiếu dữ liệu' });
            }
            const classroomDetail = yield classroom_model_1.default.findOne({ classCode: classCode });
            if (!classroomDetail)
                return reject({ status: 400, message: 'Không tìm thấy dữ liệu lớp học' });
            if (classroomDetail.students.some((student) => student == userId)) {
                return reject({ message: 'Bạn đã ở trong lớp học rồi!!!' });
            }
            classroomDetail === null || classroomDetail === void 0 ? void 0 : classroomDetail.students.push(userId);
            findUser.enrolledClassrooms.push(classroomDetail.id);
            const saveClass = yield (classroomDetail === null || classroomDetail === void 0 ? void 0 : classroomDetail.save());
            const saveUser = yield findUser.save();
            if (saveClass && saveUser)
                return resolve({ message: 'Enrollment successful' });
            return reject({ message: 'ERROR' });
        }
        catch (err) {
            return reject({ message: 'ERROR', error: err });
        }
    }));
};
exports.enrollInClassroom = enrollInClassroom;
//# sourceMappingURL=classroom.service.js.map