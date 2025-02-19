import { message } from 'antd';
import axiosCredentials from './axios.credential';
import axiosApplicationJson from './axios.default';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const getQuizzes = async () => {
    try {
        const res = await axiosCredentials.get(`/quiz/getQuizzes`);
        if (res.status === 200 && res.data) {
            await delay(2000);
            return res.data.data ?? []; // data 1 là của axios còn data sau là của mình viết api trả về
        }
    } catch (err) {
        if (err.response) {
            throw new Error(err.response?.data);
        }
    }
};
export const getQuizDetail = async (id) => {
    try {
        const res = await axiosCredentials.get(`/quiz/getQuizDetail?id=${id}`);
        if (res.status === 200 && res.data) {
            return res.data.data; // data 1 là của axios còn data sau là của mình viết api trả về
        }
        return {};
    } catch (err) {
        if (err.response) throw new Error(err.response.data);
    }
};
export const createQuiz = async (data) => {
    try {
        const { name, description, school, subject, topic, schoolYear, educationLevel, thumb } = data;

        const res = await axiosCredentials.post(
            `/quiz/create`,
            JSON.stringify({
                name,
                description,
                school,
                subject,
                topic,
                schoolYear,
                educationLevel,
                thumb,
            }),
        );
        // cấu hình để mslugdleware có thể xác thực được thông tin là đã đăng nhập bằng access token
        if (res.status === 200 && res.data) {
            return res.data.data;
        }
        return {};
    } catch (err) {
        if (err.response) {
            throw new Error(err.response.data);
        }
    }
};
export const createQuestion = async (data) => {
    try {
        const { id, partName, questionType, questionContent, answers } = data;
        const res = await axiosCredentials.put(
            `/quiz/createQuestion`,
            JSON.stringify({
                id,
                partName,
                questionType,
                questionContent,
                answers,
            }),
        );
        if (res.status === 200 && res.data) {
            return res.data.data;
        }
        return {};
    } catch (err) {
        if (err.response) {
            // Xử lý lỗi từ phản hồi HTTP
            message.error(err.response.data);
            throw new Error(err.response.data); // Ném lỗi để xử lý ở nơi gọi hàm login
        }
    }
};
export const updateQuizGeneralInfo = async (data) => {
    try {
        const res = await axiosCredentials.put(`/quiz/updateQuizGeneralInfo`, JSON.stringify(data));
        if (res.status === 200 && res.data) {
            return res.data.data;
        }
        return {};
    } catch (err) {
        // console.log(err);
        if (err.response) {
            message.error(err.response.data);
            throw new Error(err.response.data);
        }
    }
};
export const updateQuizQuestion = async (data) => {
    try {
        const res = await axiosCredentials.put(`/quiz/updateQuizQuestion`, JSON.stringify(data));
        if (res.status === 200 && res.data) {
            return res.data.data;
        }
        return res;
    } catch (err) {
        if (err.response) {
            console.log(err.response);
            throw new Error(err.response.data);
        }
    }
};
export const getQuizPreviewBySlug = async (slug) => {
    try {
        if (!slug) {
            throw new Error('Lỗi');
        }
        const res = await axiosApplicationJson.get(`/quiz/getQuizPreview/${slug}`);
        if (res.status === 200 && res.data) {
            return res.data.data; // data 1 là của axios còn data sau là của mình viết api trả về
        }
        return {};
    } catch (err) {
        throw new Error(err.response.data);
    }
};
export const getQuizForExamBySlug = async (slug) => {
    try {
        if (!slug) {
            throw new Error('Lỗi');
        }
        const res = await axiosCredentials.get(`/quiz/getQuizForExam/${slug}`);
        if (res.status === 200 && res.data) {
            return res.data.data; // data 1 là của axios còn data sau là của mình viết api trả về
        }
        return {};
    } catch (err) {
        throw new Error(err.response.data);
    }
};
export const deleteQuiz = async (data) => {
    try {
        const { id } = data;
        if (!id) {
            throw new Error('Có lỗi trong quá trình xóa');
        }
        const res = await axiosCredentials.delete(`/quiz/deleteQuiz/${id}`);
        if (res.status === 200 && res.data) {
            return res.data.data;
        }
        return {};
    } catch (err) {
        if (err.response) {
            throw new Error(err.response.data);
        }
    }
};
export const getDiscoveryQuizzes = async (data) => {
    try {
        const { name, page, limit, subject, topic, schoolYear, educationLevel } = data;
        const params = new URLSearchParams();
        Object.entries({ name, page, limit, subject, topic, schoolYear, educationLevel }).forEach(([key, value]) => {
            if (value !== undefined) {
                params.append(key, String(value));
            }
        });
        const res = await axiosApplicationJson.get(`/quiz/getDiscoveryQuizzes?${params}`);
        if (res.status === 200 && res.data) {
            return res.data.data;
        }
        return [];
    } catch (err) {
        throw new Error(err.response.data);
    }
};
