import axios from 'axios';
const axiosCredentials = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});
axiosCredentials.interceptors.response.use(
    (response) => response, // Trả về reponse nếu không có lỗi,)
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = '/dang-nhap';
            return;
        }
        return Promise.reject(error); // Trả về l��i nếu có l��i
    },
);
export default axiosCredentials;
