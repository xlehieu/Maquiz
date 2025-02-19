import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import MaquizLogo from '~/components/MaquizLogo';
import { Link, useNavigate } from 'react-router-dom';
import router, { userDashboardRouter } from '~/config';
import Tippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBookOpen,
    faChalkboardUser,
    faClockRotateLeft,
    faGauge,
    faHeart,
    faHouse,
    faRightFromBracket,
    faSearch,
    faUser,
} from '@fortawesome/free-solid-svg-icons';

const items = [
    {
        label: 'Cá nhân',
        children: [
            {
                label: 'Thư viện của tôi',
                icon: faHouse,
                to: userDashboardRouter.myDashboard,
            },
            {
                label: 'Truy cập gần đây',
                icon: faClockRotateLeft,
                to: userDashboardRouter.historyAccess,
            },
            {
                label: 'Đề thi yêu thích ',
                icon: faHeart,
            },
        ],
    },
    {
        label: 'Quản lý',
        children: [
            {
                label: 'Đề thi',
                icon: faBookOpen,
                to: userDashboardRouter.myQuiz,
            },
            {
                label: 'Lớp học',
                icon: faChalkboardUser,
                to: userDashboardRouter.classroom,
            },
        ],
    },
];
const DashboardLayout = ({ children, title = 'Maquiz' }) => {
    document.title = title;
    const navigate = useNavigate();
    const user = useSelector((state) => state.user); // dùng selector để lấy thông tin từ reducer
    useEffect(() => {
        if (!user.email) navigate('/');
    }, [user]);

    return (
        <div className="relative">
            <aside className="fixed h-screen z-10 bg-white w-56 shadow-md hidden md:block">
                <div className="flex justify-center py-3">
                    <Link to={router.home} className={'w-2/3'}>
                        <MaquizLogo />
                    </Link>
                </div>
                <ul className="mt-4">
                    {items.map((item, index) => (
                        <li key={index}>
                            <div className="text-sm pl-2 text-gray-400 py-2">{item.label}</div>
                            <div>
                                <ul className="flex flex-col">
                                    {item.children.map((child, i) => (
                                        <li className="flex" key={i}>
                                            <Link
                                                key={i}
                                                to={child.to}
                                                className="pl-8 text-gray-700 flex-1 text-base py-3 px-2 hover:text-primary ease-linear duration-200 transition-all hover:bg-opacity-10 hover:bg-slate-600 hover:rounded-3xl"
                                            >
                                                <FontAwesomeIcon className="mr-2" icon={child.icon} />
                                                {child.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            </aside>
            <header className="fixed right-0 z-20  w-full shadow-md">
                <div className="md:ml-56 px-5 py-3 bg-white grid gap-4">
                    <div className="col-start-1 col-span-3 flex items-center">
                        <p className="text-primary font-semibold inline-block">{user?.name}</p>
                    </div>
                    <div className="col-start-4 col-span-4 md:col-span-3">
                        <div className="px-3 py-2 rounded-lg border-2 flex justify-between items-center">
                            <input
                                placeholder="Tìm kiếm đề thi"
                                className="outline-none border-none caret-primary flex flex-1"
                            />
                            <FontAwesomeIcon className="w-1/5" icon={faSearch} />
                        </div>
                    </div>
                    <div className="col-start-11 col-span-2 flex justify-center content-center">
                        <Tippy
                            interactive
                            placement="bottom-end"
                            render={(attrs) => (
                                <div className="flex flex-col shadow bg-white" tabIndex="-1" {...attrs}>
                                    <Link
                                        className="text-gray-600 duration-200 px-2 py-2 hover:rounded hover:bg-black hover:bg-opacity-5"
                                        to={router.profile}
                                    >
                                        <FontAwesomeIcon icon={faUser} className="pr-2" />
                                        Thông tin tài khoản
                                    </Link>
                                    <Link
                                        to={userDashboardRouter.myDashboard}
                                        className="text-gray-600 duration-200 px-2 py-2 hover:rounded hover:bg-black hover:bg-opacity-5"
                                    >
                                        <FontAwesomeIcon icon={faGauge} className="pr-2" />
                                        Dashboard
                                    </Link>
                                    <button
                                        className="text-start px-2 py-2 text-gray-600 duration-200 hover:rounded hover:bg-black hover:bg-opacity-5"
                                        onClick={() => {}}
                                    >
                                        <FontAwesomeIcon icon={faRightFromBracket} className="pr-2" />
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        >
                            <div className="flex justify-between items-center">
                                {user?.avatar && (
                                    <img className="rounded-full mr-1 w-8 h-8" src={user?.avatar} alt={user?.name} />
                                )}
                                <p className="text-lg text-primary">{user?.name}</p>
                            </div>
                        </Tippy>
                    </div>
                </div>
            </header>
            <main className="md:ml-56 h-full bg-[#fcfcfc]">
                <div className="md:mx-10 py-20">{children}</div>
            </main>
        </div>
    );
};
export default DashboardLayout;
