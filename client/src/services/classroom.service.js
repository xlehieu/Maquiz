import axiosCredentials from './axios.credential';

export const createClassroom = async (data) => {
    try {
        const { classroomName, subjectName } = data;
        if (!classroomName?.trim() || !subjectName?.trim()) {
            throw new Error('Tên lớp học và tên môn học không thể bỏ trống');
        }
        const response = await axiosCredentials.post(
            '/classroom/createClassroom',
            JSON.stringify({
                name: classroomName,
                subject: subjectName,
            }),
        );
        if (response.data) return response.data?.data;
        return null;
    } catch (err) {
        if (err.response) {
            throw new Error(err.response?.data?.message);
        }
    }
};
export const getUserClassrooms = async () => {
    try {
        const response = await axiosCredentials.get('/classroom/getUserClassrooms');
        if (response.data) return response.data?.data;
        return null;
    } catch (err) {
        if (err.response) {
            throw new Error(err?.response?.data?.message);
        }
    }
};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const getClassroomDetail = async (data) => {
    try {
        const { classCode } = data;
        const params = new URLSearchParams();
        Object.entries({ classCode }).forEach(([key, value]) => {
            if (value !== undefined) {
                params.append(key, String(value));
            }
        });
        if (!classCode?.trim()) throw 'Lỗi';
        const res = await axiosCredentials.get(`/classroom/getClassroomDetail?${params}`);
        if (res.status === 200 && res.data) {
            return res.data.data;
        }
        return null;
    } catch (err) {
        if (err.response) {
            throw new Error(err?.response?.data?.message);
        }
    }
};
export const enrollInClassroom = async (data) => {
    try {
        const { classCode } = data;
        if (!classCode?.trim()) throw 'Vui lòng nhập mã lớp';
        const res = await axiosCredentials.patch('/classroom/enrollInClassroom', JSON.stringify({ classCode }));
        if (res.status === 200 && res.data) {
            return res.data.data;
        }
        return null;
    } catch (err) {
        if (err.response) {
            throw new Error(err?.response?.data.message);
        }
    }
};
