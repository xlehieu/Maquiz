import { Request } from 'express';
import ClassRoom from '../models/classroom.model';
import mongoose, { Types } from 'mongoose';
import User from '@models/user.model';
import { generateUniqueRandomString } from '~/src/utils';
import { imageClassThumbnailDefault } from '~/src/constants';
export const getUserClassrooms = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { user } = req.body;
            const findUser = await User.findById(user.id);
            if (!findUser) return reject({ message: 'Không tìm thấy người dùng' });
            const teacherId = user?.id && Types.ObjectId.isValid(user.id) ? user.id : new Types.ObjectId(user.id);
            const myClassrooms = await ClassRoom.find({ teacher: teacherId })
                .select(['name', 'classCode', 'thumb'])
                .populate('teacher', 'name avatar');
            //toán tử in, tìm các phần tử trong dánh sách, như trên là tìm _id của Classroom nào có trong enrolledClassrooms
            const enrolledClassrooms = await ClassRoom.find({
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
        } catch (err) {
            console.log(err);
            reject({ message: 'Lỗi', error: err });
        }
    });
};
export const createClassroom = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { name, subject, user } = req.body;
            console.log('req body', req.body);
            if (!name?.trim() || !subject?.trim()) {
                if (!mongoose.Types.ObjectId.isValid(user?.id)) {
                    return reject({ message: 'Không tìm thấy người dùng' });
                }
                return reject({ message: 'Thiếu dữ liệu' });
            }
            const teacher = await User.findById(new Types.ObjectId(user?.id));
            if (!teacher) return reject({ message: 'Không tìm thấy giáo viên' });
            //tạo lớp class code
            let classCode = generateUniqueRandomString(6);
            console.log(classCode);
            let classCodeExists = await mongoose.models.classroom.exists({ classCode });
            // kiểm tra xem có trùng không?
            while (classCodeExists) {
                classCode = generateUniqueRandomString(6);
                classCodeExists = await mongoose.models.classroom.exists({ classCode });
            }
            classCode = classCode;
            const thumb = imageClassThumbnailDefault[Math.floor(Math.random() * imageClassThumbnailDefault.length)];
            const classroom = await ClassRoom.create({ name, subject, teacher: user.id, thumb, classCode });
            console.log(classroom);
            teacher.myClassrooms.push(classroom.id);
            await teacher.save();
            if (classroom) {
                resolve({ message: 'successfully created classroom', data: classroom });
            }
        } catch (err) {
            reject({ message: 'Lỗi', error: err });
        }
    });
};
export const getClassroomDetail = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { classCode } = req.body;
            if (!classCode) {
                return reject({ status: 400, message: 'Thiếu dữ liệu' });
            }
            const classroomDetail = await ClassRoom.findOne({ classCode: classCode }).select(['-id']);
            if (!classroomDetail) return reject({ status: 400, message: 'Không tìm thấy dữ liệu lớp học' });
            const students = await User.find({
                _id: {
                    $in: classroomDetail?.students,
                },
            });
            const data = Object.assign(classroomDetail, students);
            return resolve({ message: 'Successfully fetched classroom', data: data });
        } catch (err) {
            return reject({ message: 'ERROR', error: err });
        }
    });
};
export const enrollInClassroom = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { classCode, user } = req.body;
            const userId = user?.id && Types.ObjectId.isValid(user.id) ? user.id : null;
            const findUser = await User.findById(userId);
            if (!classCode || !findUser) {
                return reject({ status: 400, message: 'Thiếu dữ liệu' });
            }
            const classroomDetail = await ClassRoom.findOne({ classCode: classCode });
            if (!classroomDetail) return reject({ status: 400, message: 'Không tìm thấy dữ liệu lớp học' });
            if (classroomDetail.students.some((student) => student == userId)) {
                return reject({ message: 'Bạn đã ở trong lớp học rồi!!!' });
            }
            classroomDetail?.students.push(userId);
            findUser.enrolledClassrooms.push(classroomDetail.id);
            const saveClass = await classroomDetail?.save();
            const saveUser = await findUser.save();
            if (saveClass && saveUser) return resolve({ message: 'Enrollment successful' });
            return reject({ message: 'ERROR' });
        } catch (err) {
            return reject({ message: 'ERROR', error: err });
        }
    });
};
