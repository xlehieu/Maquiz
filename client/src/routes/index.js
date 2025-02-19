import router from '~/config';
import adminRoutes from './adminRoutes';
import userDashboardRoutes from './userDashboardRoutes';
import quizRoutes from './quizRoutes';
import { lazy } from 'react';
const SubLayout = lazy(() => import('~/layouts/SubLayout'));
const DefaultLayout = lazy(() => import('../layouts/DefaultLayout'));
const SignInUpLayout = lazy(() => import('~/layouts/SignInUpLayout'));
const NotFoundLayout = lazy(() => import('~/layouts/NotFoundLayout'));
const HomePage = lazy(() => import('../pages/Site/HomePage/HomePage'));
const NotFoundPage = lazy(() => import('../pages/Site/NotFoundPage/NotFoundPage'));
const SignInPage = lazy(() => import('~/pages/Site/SignInPage'));
const SignUpPage = lazy(() => import('~/pages/Site/SignUpPage'));
const ProfileUser = lazy(() => import('~/pages/Site/ProfileUser'));
const CreateQuizPage = lazy(() => import('~/pages/QuizPage/CreateQuizPage'));
const DiscoverPage = lazy(() => import('~/pages/Site/DiscoveryPage'));
export const publicRoutes = [
    { path: router.home, component: HomePage, layout: DefaultLayout },
    { path: router.signIn, component: SignInPage, layout: SignInUpLayout, title: 'Đăng nhập' },
    { path: router.signUp, component: SignUpPage, layout: SignInUpLayout, title: 'Đăng ký' },
    { path: router.profile, component: ProfileUser, layout: DefaultLayout },
    { path: router.createQuiz, component: CreateQuizPage, layout: DefaultLayout, title: 'Tạo đề thi' },
    { path: router.discover, component: DiscoverPage, layout: SubLayout, title: 'Khám phá' },
    // { path: router.reviewQuiz, component: QuizPages.ReviewQuizPage, layout: DefaultLayout },
    //Admin
    ...adminRoutes,
    //Dashboard
    ...userDashboardRoutes,
    ...quizRoutes,
    { path: router.notFoundPage, component: NotFoundPage, layout: NotFoundLayout },
];
