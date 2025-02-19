const router = {
    home: '/',
    signIn: '/dang-nhap',
    signUp: '/dang-ky',
    profile: '/thong-tin',
    createQuiz: '/tao-de-thi',
    notFoundPage: '/*',
    discover: '/discovery',
    admin: '/tui-la-admin',
    adminProduct: '/tui-la-admin/products',
    adminProductCreate: '/tui-la-admin/products/create',
    adminProductDetail: '/tui-la-admin/products/detail/:id',
    adminProductUpdate: '/tui-la-admin/products/update',
    adminProductDelete: '/tui-la-admin/products/delete',
};
export const userDashboardRouter = {
    myDashboard: '/my-dashboard',
    historyAccess: '/my-dashboard/truy-cap-gan-day',
    myQuiz: '/my-dashboard/de-thi-cua-toi',
    myQuizDetail: '/my-dashboard/de-thi-cua-toi/:id',
    editMyQuiz: '/my-dashboard/de-thi-cua-toi/chinh-sua/:id',
    classroom: '/my-dashboard/classroom',
    createClassroom: '/my-dashboard/classroom/tao-lop-hoc',
};
export const quizRouter = {
    reviewQuiz: '/review-quiz',
    takeQuiz: '/take-quiz',
};
export default router;
