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
        return;
    } catch (err) {
        if (err.response) {
            throw new Error(err.response.data);
        }
    }
};
export const getUserClassrooms = async () => {
    try {
        const response = await axiosCredentials.get('/classroom/getUserClassrooms');
        if (response.data) return response.data?.data;
        return;
    } catch (err) {
        if (err.response) {
            throw new Error(err.response.data);
        }
    }
};
