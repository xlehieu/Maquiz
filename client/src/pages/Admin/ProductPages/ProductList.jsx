import React, { useEffect } from 'react';
import { NumberOutlined, FileImageOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import * as ProductService from '~/services/AdminProductService';
import router from '~/config';
import { useDispatch, useSelector } from 'react-redux';
import { updateProducts } from '~/redux/slices/product.slice';
import { VND } from '~/utils';
const ProductsPage = () => {
    const dispatch = useDispatch();
    const handleGetAllProduct = async (page) => {
        return await ProductService.getAllProduct(page);
    };
    let products = useSelector((state) => state.products);
    useEffect(() => {
        handleGetAllProduct(0).then((res) => {
            const { data, totalProduct, currentPage, totalPage } = res;
            dispatch(updateProducts({ data, totalProduct, currentPage, totalPage }));
        });
    }, []);

    const handlePageClick = async (e) => {
        const data = await ProductService.getAllProduct(e.selected);
        dispatch(updateProducts(data));
    };
    return (
        <div>
            <div className="mb-3 flex justify-between">
                <h3 className="text-primary font-semibold">Danh sách sản phẩm</h3>
                <Link
                    to={router.adminProductCreate}
                    className="bg-primary rounded-md px-2 py-1 flex items-center text-white"
                >
                    Thêm sản phẩm
                </Link>
            </div>
            <div className="my-1">
                <span>Trang: {products ? products.currentPage : 1}</span>
            </div>
            <table className="table-fixed w-full">
                <thead className="border-y border-gray-200 bg-gray-10">
                    <tr>
                        <th className="w-14 py-2">
                            <NumberOutlined />
                        </th>
                        <th className="w-16">
                            <FileImageOutlined />
                        </th>
                        <th>Tên sản phẩm</th>
                        <th className="w-40">Giá</th>
                        <th className="w-40">Số lượng</th>
                        <th className="w-52">Danh mục</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.data &&
                        products?.data.map((product, index) => (
                            <tr key={index}>
                                <td className="text-center font-semibold py-4">{index + 1}</td>
                                <td className="py-4">
                                    <Link to={`/tui-la-admin/products/detail/${product._id}`}>
                                        <img
                                            width={40}
                                            height={40}
                                            src={product.thumb}
                                            alt={product.name}
                                            className=" m-auto rounded-full"
                                        />
                                    </Link>
                                </td>
                                <td className="line-clamp-2 items-center my-4">
                                    <Link to={`/tui-la-admin/products/detail/${product._id}`}>{product.name}</Link>
                                </td>
                                <td className="text-center py-4">{VND.format(product.price)}</td>
                                <td className="text-center py-4">{product.quantity}</td>
                                <td className="text-center py-4">{product.category}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        pageCount={products ? products.totalPage : 100}
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                        containerClassName="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        pageClassName="relative inline-flex items-center text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-primary hover:opacity-80 hover:text-white focus:z-20 focus:outline-offset-0"
                        pageLinkClassName="px-4 py-2"
                        activeLinkClassName="z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        previousLinkClassName="relative inline-flex items-center rounded-s-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-primary hover:opacity-80 hover:text-white"
                        nextLinkClassName="relative inline-flex items-center rounded-e-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-primary hover:opacity-80 hover:text-white"
                        breakClassName="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                    />
                    {/*                             

                            <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                                ...
                            </span> */}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
