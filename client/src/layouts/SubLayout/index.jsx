import { faMoon } from '@fortawesome/free-regular-svg-icons';
import { faBookOpen, faClockRotateLeft, faExpand, faHeart, faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react/headless';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MaquizLogo from '~/components/MaquizLogo';
import router, { userDashboardRouter } from '~/config';
const SubLayout = ({ children }) => {
    const user = useSelector((state) => state.user);
    const [isExpand, setIsExpand] = useState(false);
    const toggleExpand = () => {
        if (!isExpand) {
            // document.documentElement.requestFullscreen?.() documentElement dùng để chuyển tất c ả các phần tử trong trang sang chế độ toàn màn hình
            //còn khi thoát thì không cần documentElement vì bất kỳ phần tử nào cũng phải thoát nên không cần thêm documenElement
            // ngoài ra webkit, moz, ms là để hỗ trợ các trình duyệt cũ
            document.documentElement.requestFullscreen?.() ||
                document.documentElement.webkitRequestFullscreen?.() ||
                document.documentElement.mozRequestFullScreen?.() ||
                document.documentElement.msRequestFullscreen?.();
        } else {
            document.exitFullscreen?.() ||
                document.webkitExitFullscreen?.() ||
                document.mozCancelFullScreen?.() ||
                document.msExitFullscreen?.();
        }
        setIsExpand(!isExpand);
    };
    return (
        <div className="bg-[#fcfcfc] select-none min-h-svh">
            <header className="w-full bg-white md:h-20 md:shadow-md">
                <div className="container px-0 md:px-5 mx-0 md:mx-auto hidden md:flex justify-between items-center h-full">
                    <Link to={router.home} className="w-40 h-full">
                        <MaquizLogo className={'w-full h-full object-contain'} />
                    </Link>
                    <div className="hidden md:flex space-x-7 justify-between items-center">
                        <button onClick={toggleExpand}>
                            <FontAwesomeIcon icon={faExpand} className="text-primary" />
                        </button>
                        <button>
                            <FontAwesomeIcon icon={faMoon} className="text-primary" />
                        </button>
                        {user.email ? ( // Menu tippy
                            <Tippy
                                interactive
                                placement="bottom-end"
                                render={(attrs) => (
                                    <div className="flex flex-col shadow bg-white" tabIndex="-1" {...attrs}>
                                        <Link
                                            className="text-black px-2 py-2 hover:rounded hover:bg-black hover:bg-opacity-5"
                                            to={router.profile}
                                        >
                                            Thông tin tài khoản
                                        </Link>
                                        <Link
                                            to={userDashboardRouter.myDashboard}
                                            className="text-black px-2 py-2 hover:rounded hover:bg-black hover:bg-opacity-5"
                                        >
                                            Dashboard
                                        </Link>
                                        <button className="text-start px-2 py-2 text-black hover:rounded hover:bg-black hover:bg-opacity-5">
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            >
                                <div className="flex justify-between items-center">
                                    {user?.avatar && (
                                        <img
                                            className="rounded-full mr-1 w-8 h-8"
                                            src={user?.avatar}
                                            alt={user?.name}
                                        />
                                    )}
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
                    </div>
                </div>
            </header>
            <div className="w-full">
                <div className="container mx-auto px-2 md:px-5 mt-5">{children}</div>
            </div>
        </div>
    );
};

export default SubLayout;
