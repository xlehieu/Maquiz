import React, { useEffect, useState } from 'react';
import { EyeOutlined, EyeInvisibleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as UserService from '~/services/user.service';
import useMutationHooks from '~/hooks/useMutationHooks';
import { message } from 'antd';
import { updateUser } from '~/redux/slices/user.slice';
import router from '~/config';
import Cookies from 'js-cookie';

const SignInPage = () => {
    const navigate = useNavigate();
    const emailCookie = Cookies.get('user_email');
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [emailValue, setEmailValue] = useState(emailCookie);
    const [passwordValue, setPasswordValue] = useState('');
    const dispatch = useDispatch();

    const handleOnChangeEmail = (e) => {
        setEmailValue(e.target.value);
    };
    const handleOnChangePassword = (e) => {
        setPasswordValue(e.target.value);
    };
    const loginMutation = useMutationHooks((data) => UserService.login(data));
    const handleOnClick = (e) => {
        e.preventDefault();
        loginMutation.mutate({
            email: emailValue,
            password: passwordValue,
        });
    };
    //Sau khi chạy đến hết đoạn code logic thì state mới được set lại để re-render component
    //vậy nên đến đây thì emailValue vẫn chưa được set lại
    const getUserDetailMutation = useMutationHooks(() => UserService.getUserDetail());
    useEffect(() => {
        if (loginMutation.isSuccess) {
            getUserDetailMutation.mutate();
        } else if (loginMutation.isError) {
            message.error(loginMutation.error.message);
        }
    }, [loginMutation.isSuccess, loginMutation.isError]);
    useEffect(() => {
        if (getUserDetailMutation.data) {
            dispatch(updateUser({ ...getUserDetailMutation.data.data }));
            message.success('Đăng nhập thành công');
            navigate('/');
        } else if (getUserDetailMutation.isError) {
            message.error('Đăng nhập không thành công');
        }
    }, [getUserDetailMutation.isSuccess, getUserDetailMutation.isError]);
    return (
        <div className="w-full">
            <form className="mx-auto w-full md:max-w-96 space-y-6" method="post">
                <input
                    id="input-email"
                    className="border border-gray-500 py-2 px-3 w-full outline-none"
                    value={emailValue}
                    onChange={(e) => handleOnChangeEmail(e)}
                    autoComplete="email"
                    placeholder="Email"
                    type="email"
                    name="email"
                />
                <div className="flex px-3 py-2 border border-gray-500 box-border w-full  outline-primary">
                    <input
                        id="input-password"
                        className="outline-none mr-2 flex-1"
                        type={isShowPassword ? 'text' : 'password'}
                        onChange={(e) => handleOnChangePassword(e)}
                        autoComplete="current-password"
                        value={passwordValue}
                        placeholder="Mật khẩu"
                        name="password"
                    />

                    {isShowPassword ? (
                        <EyeOutlined onClick={() => setIsShowPassword(!isShowPassword)} />
                    ) : (
                        <EyeInvisibleOutlined onClick={() => setIsShowPassword(!isShowPassword)} />
                    )}
                </div>
                <button
                    disabled={!emailValue || !passwordValue || loginMutation.isPending}
                    onClick={handleOnClick}
                    className={`w-full cursor-pointer bg-primary text-white rounded py-1 ${
                        (!emailValue || !passwordValue || loginMutation.isPending) && 'opacity-40 cursor-default'
                    }`}
                >
                    {loginMutation.isPending ? <LoadingOutlined /> : 'ĐĂNG NHẬP'}
                </button>
            </form>
            <div className="mt-3 mx-auto w-full md:max-w-96">
                <p>
                    Bạn chưa có tài khoản?{' '}
                    <Link to={router.signUp} className="text-primary font-semibold">
                        Đăng ký tài khoản
                    </Link>
                </p>
            </div>
        </div>
    );
};
export default SignInPage;
