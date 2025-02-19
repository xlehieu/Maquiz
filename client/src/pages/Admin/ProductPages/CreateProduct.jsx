import React, { useState } from 'react';
import { showImage, isNumber } from '~/utils';
import * as ProductService from '~/services/AdminProductService';
import useMutationHooks from '~/hooks/useMutationHooks';
import { imageDB } from '~/firebase/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import router from '~/config';
const CreateProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');
    const [thumb, setThumb] = useState('');
    const [thumbUI, setThumbUI] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const createProduct = async (product, token) => {
        return await ProductService.createProduct(product, token);
    };
    const handleChangThumbnail = async (file) => {
        setThumb(file);
        file = await showImage(file);
        setThumbUI(file);
    };
    const handleClickCreate = async (e) => {
        setLoading(true);
        e.preventDefault();
        if (!name || !description || !price || !discount || !quantity || !category || !thumb) {
            message.error('Thêm sản phẩm không thành công, thiếu dữ liệu ');
            setLoading(false);
            return;
        }
        if (!isNumber(price) || !isNumber(discount) || !isNumber(quantity)) {
            message.error('Giá, Giảm giá, số lượng phải là dạng số');
            setLoading(false);
            return;
        }
        let thumbNew;
        const imgRef = ref(imageDB, `uploadProductThumbnail/${thumb.name}`);
        await uploadBytes(imgRef, thumb).then(async (value) => {
            await getDownloadURL(value.ref).then((url) => {
                thumbNew = url;
            });
        });
        const token = localStorage.getItem('access_token');
        const product = {
            name,
            description,
            price,
            discount,
            quantity,
            category,
            thumb: thumbNew,
        };
        const res = await createProduct(product, token);
        if (res?.status === 'OK') {
            message.success('Thêm sản phẩm thành công');
            navigate(router.adminProduct);
        }
        setLoading(false);
    };
    return (
        <form className="container mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" method="post">
            <div className="md:col-span-1 lg:col-span-2">
                <div className="relative z-0 w-full mb-5 ">
                    <input
                        name="name"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-primaryLight focus:outline-none focus:ring-0 focus:border-primary peer"
                        placeholder=""
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <label
                        htmlFor="name"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-primary peer-focus:dark:text-primaryLight peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        Tên sản phẩm
                    </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-normal text-gray-500 dark:text-white"
                    >
                        Mô tả
                    </label>
                    <textarea
                        id="description"
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="outline-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-primaryLight dark:bg-gray-300 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primaryLight dark:focus:border-priring-primaryLight"
                        placeholder="Mô tả sản phẩm"
                    ></textarea>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input
                        name="category"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-primaryLight focus:outline-none focus:ring-0 focus:border-primary peer"
                        placeholder=" "
                        required
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                    />
                    <label
                        htmlFor="category"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-primary peer-focus:dark:text-primaryLight peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        Danh mục sản phẩm
                    </label>
                </div>
                <div className="relative z-0 w-full justify-end flex">
                    <button
                        type="submit"
                        onClick={(e) => handleClickCreate(e)}
                        disabled={loading}
                        className="text-white disabled:cursor-not-allowed sm:w-full lg:w-40  bg-primary hover:bg-primaryLight focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                    >
                        {loading ? <LoadingOutlined /> : 'Thêm sản phẩm'}
                    </button>
                </div>
            </div>
            <div className="col-span-1">
                <div className="md:gap-6">
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            name="price"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-primaryLight focus:outline-none focus:ring-0 focus:border-primary peer"
                            placeholder=" "
                            required
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                        />
                        <label
                            htmlFor="price"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-primary peer-focus:dark:text-primaryLight peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Giá
                        </label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            name="discount"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-primaryLight focus:outline-none focus:ring-0 focus:border-primary peer"
                            placeholder=" "
                            required
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                        />
                        <label
                            htmlFor="discount"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-primary peer-focus:dark:text-primaryLight peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Giảm giá
                        </label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="quantity"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-primaryLight focus:outline-none focus:ring-0 focus:border-primary peer"
                            placeholder=" "
                            required
                            onChange={(e) => setQuantity(e.target.value)}
                            value={quantity}
                        />
                        <label
                            htmlFor="quantity"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-primary peer-focus:dark:text-primaryLight peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Số lượng
                        </label>
                    </div>
                </div>
                <div className="">
                    <div className="relative z-0 w-full mb-5 group">
                        <label
                            className="block mb-2 font-normal text-sm  text-gray-500 dark:text-white"
                            htmlFor="user_avatar"
                        >
                            Thumb
                        </label>
                        <input
                            className="block w-full text-sm  text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            aria-describedby="user_avatar_help"
                            id="user_avatar"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleChangThumbnail(e.target.files[0])}
                        />
                        {thumbUI && <img className="rounded-sm" src={thumbUI} alt={''} />}
                    </div>
                </div>
            </div>
        </form>
    );
};

export default CreateProduct;
