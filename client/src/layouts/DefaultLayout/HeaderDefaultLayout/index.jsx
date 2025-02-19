import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardOutlined, IdcardOutlined, LogoutOutlined } from '@ant-design/icons';
import * as UserService from '~/services/user.service';
import { resetUser } from '~/redux/slices/user.slice';
import router, { userDashboardRouter } from '~/config';
import Tippy from '@tippyjs/react/headless';
import MaquizLogo from '../../../components/MaquizLogo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import BlurBackground from '../../../components/BlurBackground';
import { motion, AnimatePresence } from 'framer-motion';
import LazyImage from '~/components/LazyImage';
const menuVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
};
const HeaderComponent = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const handleLogOut = async () => {
        await UserService.logout();
        dispatch(resetUser({}));
    };
    const [isMobileResponsive, setIsMobileResponsive] = useState(false);
    return (
        <header className="w-full border-b-2 bg-white">
            <div className={'container mx-auto flex justify-between items-centers px-5 py-4'}>
                <div className="block">
                    <Link to={router.home}>
                        <MaquizLogo className="w-2/4" alt="logo" />
                    </Link>
                </div>
                <nav className="hidden md:flex items-center justify-end">
                    <Link
                        className="w-24 flex items-center justify-center text-primary text-lg  duration-300 hover:text-secondary"
                        to={'/'}
                    >
                        Tin tức
                    </Link>
                    <Link
                        className="w-24 flex items-center justify-center text-primary text-lg  duration-300 hover:text-secondary"
                        to={'/'}
                    >
                        Liên hệ
                    </Link>
                    {user?.email ? ( // Menu tippy
                        <Tippy
                            interactive
                            placement="bottom-end"
                            render={(attrs) => (
                                <div className="flex flex-col shadow bg-white" tabIndex="-1" {...attrs}>
                                    <Link
                                        className="text-black px-2 py-2 hover:rounded hover:bg-black hover:bg-opacity-5"
                                        to={router.profile}
                                    >
                                        <IdcardOutlined className="pr-2" />
                                        Thông tin tài khoản
                                    </Link>
                                    <Link
                                        to={userDashboardRouter.myDashboard}
                                        className="text-black px-2 py-2 hover:rounded hover:bg-black hover:bg-opacity-5"
                                    >
                                        <DashboardOutlined className="pr-2" />
                                        Dashboard
                                    </Link>
                                    <button
                                        className="text-start px-2 py-2 text-black hover:rounded hover:bg-black hover:bg-opacity-5"
                                        onClick={handleLogOut}
                                    >
                                        <LogoutOutlined className="pr-2" />
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        >
                            <div className="flex justify-between items-center">
                                {user?.avatar && (
                                    <LazyImage
                                        className="rounded-full mr-1 w-8 h-8 overflow-hidden"
                                        src={user?.avatar}
                                        alt={user?.name}
                                        placeholder={'...'}
                                    />
                                )}
                                <p className="text-lg text-primary">{user?.name}</p>
                            </div>
                        </Tippy>
                    ) : (
                        <Link
                            className="w-24 flex items-center justify-center text-primary text-lg duration-300 hover:text-secondary"
                            to={router.signIn}
                        >
                            Đăng nhập
                        </Link>
                    )}
                </nav>
                <div className="md:hidden z-40 flex items-center">
                    <button className="px-2 py-2" onClick={() => setIsMobileResponsive(!isMobileResponsive)}>
                        <FontAwesomeIcon className="text-2xl" icon={isMobileResponsive ? faClose : faBars} />
                    </button>
                </div>
                <AnimatePresence>
                    {isMobileResponsive && (
                        <>
                            <motion.nav
                                key="mobile-menu"
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={menuVariants}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                className="absolute z-30 py-10 h-full bg-white shadow-lg min-w-72 max-w-full right-0 top-0 flex flex-col text-3xl space-y-5 items-start"
                            >
                                <Link
                                    className="mt-10 w-full px-6 py-3 text-gray-600 font-semibold border-b-2 transition-all duration-300"
                                    to={'/'}
                                >
                                    Tin tức
                                </Link>
                                <Link
                                    className="mt-10 w-full px-6 py-3 text-gray-600 font-semibold border-b-2 transition-all duration-300"
                                    to={'/'}
                                >
                                    Liên hệ
                                </Link>
                                {user.email ? (
                                    <>
                                        <Link
                                            className="mt-10 w-full px-6 py-3 text-gray-600 font-semibold border-b-2 transition-all duration-300"
                                            to={router.profile}
                                        >
                                            Thông tin tài khoản
                                        </Link>
                                        <Link
                                            to={userDashboardRouter.myDashboard}
                                            className="mt-10 w-full px-6 py-3 text-gray-600 font-semibold border-b-2 transition-all duration-300"
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            className="mt-10 w-full px-6 py-3 text-gray-600 text-left font-semibold border-b-2 transition-all duration-300"
                                            onClick={handleLogOut}
                                        >
                                            Đăng xuất
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to={router.signIn}
                                        className="mt-10 w-full px-6 py-3 text-gray-600 font-semibold border-b-2 transition-all duration-300"
                                    >
                                        Đăng nhập
                                    </Link>
                                )}
                            </motion.nav>
                            <BlurBackground
                                isActive={isMobileResponsive}
                                onClick={() => setIsMobileResponsive(!isMobileResponsive)}
                            />
                        </>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default HeaderComponent;
