import { Request } from 'express';
import ClassRoom from '../models/classroom.model';
import mongoose, { Types } from 'mongoose';
import User from '@models/user.model';
export const getUserClassrooms = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { user } = req.body;
            const findUser = await User.findById(user.id);
            if (!findUser) return reject({ message: 'Không tìm thấy người dùng' });
            const teacherId = Types.ObjectId.isValid(user.id) ? new Types.ObjectId(user.id) : user.id;
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
            const classroom = await ClassRoom.create({ name, subject, teacher: user.id });
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
