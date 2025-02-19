import axios from 'axios';

const axiosApplicationJson = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
export default axiosApplicationJson;
