import axios from 'axios';
const config = {
    headers: {
        'Content-Type': 'application/json',
    },
};

export const getAllProduct = async (page) => {
    if (page < 0) page = 0;
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product?page=${page}`);
    if (res) return res.data;
};
export const createProduct = async (product, token) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, JSON.stringify(product), {
        headers: {
            ...config.headers,
            authorization: token,
        },
    });
    if (res) return res.data;
};
