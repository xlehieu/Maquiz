import React from 'react';
import { useSelector } from 'react-redux';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import Button from '~/components/Button';
import router from '~/config';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMountainSun, faSearch } from '@fortawesome/free-solid-svg-icons';

const bg = require('~/asset/image/bg-home.png');
export default function HomePage() {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    return (
        <>
            <div className="grid grid-rows-10 gap-4 grid-flow-col w-1/3 mt-6">
                <div className="row-span-1">
                    <span className="font-bold text-2xl text-primary">Maquiz</span> - #1 Nền tảng thi trắc nghiệm online
                    tốt nhất
                </div>
                <div className="row-span-2">
                    Tạo câu hỏi và đề thi nhanh với những giải pháp thông minh.{' '}
                    <span className="font-bold text-primary">Maquiz</span> tận dụng sức mạnh công nghệ để nâng cao trình
                    độ học tập của bạn.
                </div>
                <div className="row-span-1 grid grid-cols-2 grid-flow-col">
                    {user.email && user.email !== '' && (
                        <div className="col-span-1 flex justify-center">
                            <Link className="bg-primary rounded px-2 py-1 text-white" to={router.createQuiz}>
                                Tạo đề thi ngay
                            </Link>
                        </div>
                    )}
                    <div className="col-span-1 flex justify-center">
                        <button
                            className="rounded bg-primary px-3 py-1 text-white"
                            onClick={() => navigate(router.discover)}
                        >
                            <FontAwesomeIcon icon={faMountainSun} className="mr-2" />
                            Khám phá
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-2/3 absolute right-3 top-40">
                <img src={bg} alt="bg" />
            </div>
        </>
    );
}
