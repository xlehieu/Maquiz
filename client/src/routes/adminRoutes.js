import { lazy } from 'react';
import router from '~/config';
import { productText } from '~/constants';
const AdminPage = lazy(() => import('~/pages/AdminPage'));
const AdminLayout = lazy(() => import('~/layouts/AdminLayout'));
const ProductsPage = lazy(() => import('~/pages/Admin/ProductPages/ProductList'));
const CreateProduct = lazy(() => import('~/pages/Admin/ProductPages/CreateProduct'));
const DetailProduct = lazy(() => import('~/pages/Admin/ProductPages/DetailProduct'));
const UpdateProduct = lazy(() => import('~/pages/Admin/ProductPages/UpdateProduct'));
const adminRoutes = [
    { path: router.admin, isPrivate: true, component: AdminPage, layout: AdminLayout, header: 'Dashboard' },
    {
        path: router.adminProduct,
        isPrivate: true,
        component: ProductsPage,
        header: productText,
        layout: AdminLayout,
    },
    {
        path: router.adminProductCreate,
        isPrivate: true,
        component: CreateProduct,
        header: productText,
        layout: AdminLayout,
    },
    {
        path: router.adminProductDetail,
        isPrivate: true,
        header: productText,
        component: DetailProduct,
        layout: AdminLayout,
    },
    {
        path: router.adminProductUpdate,
        isPrivate: true,
        header: productText,
        component: UpdateProduct,
        layout: AdminLayout,
    },
];
export default adminRoutes;
