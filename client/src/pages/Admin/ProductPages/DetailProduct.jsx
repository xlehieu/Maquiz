import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const DetailProduct = () => {
    const { id } = useParams();
    const productList = useSelector((state) => state.products);
    const [product, setProduct] = useState({});
    useEffect(() => {
        if (productList?.data.length > 0) {
            productList.data.map((val) => {
                if (val._id === id) {
                    setProduct(val);
                }
            });
        }
    }, [id]);
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-5 py-5">
            <h3 className="font-bold text-primary mb-6">Thông tin sản phẩm</h3>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <tbody>
                    <tr className="bg-neutral-100">
                        <td className="py-3 px-3">Mã sản phẩm:</td>
                        <td className="py-3 px-3">{product?._id}</td>
                    </tr>
                    <tr>
                        <td className="py-3 px-3">Tên:</td>
                        <td className="py-3 px-3">{product?.name}</td>
                    </tr>
                    <tr className="bg-neutral-100">
                        <td className="py-3 px-3">Mô tả:</td>
                        <td className="py-3 px-3">{product?.description}</td>
                    </tr>
                    <tr>
                        <td className="py-3 px-3">Danh mục:</td>
                        <td className="py-3 px-3">{product?.category}</td>
                    </tr>
                    <tr className="bg-neutral-100">
                        <td className="py-3 px-3">Giá:</td>
                        <td className="py-3 px-3">{product?.price}</td>
                    </tr>
                    <tr>
                        <td className="py-3 px-3">Giảm giá:</td>
                        <td className="py-3 px-3">{product?.discount}</td>
                    </tr>
                    <tr className="bg-neutral-100">
                        <td className="py-3 px-3">Số lượng:</td>
                        <td className="py-3 px-3">{product?.quantity}</td>
                    </tr>
                    <tr>
                        <td className="py-3 px-3">Thumbnail:</td>
                        <td className="py-3 px-3">
                            <img src={product?.thumb} alt={product?.name} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default DetailProduct;
