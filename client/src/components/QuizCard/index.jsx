import {
    faBookOpenReader,
    faChartSimple,
    faCircleQuestion,
    faEdit,
    faEye,
    faPlayCircle,
    faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { memo } from 'react';
import { ScaleLoader } from 'react-spinners';
import { colors } from '~/constants';
import LazyImage from '../LazyImage';
import { Link, useNavigate } from 'react-router-dom';
import { userDashboardRouter } from '~/config';
import { Popover } from 'antd';

const QuizCard = ({ title, slug, time, questionCount = 0, accessCount = 0, examCount = 0, imageSrc, id, onDelete }) => {
    const navigate = useNavigate();
    return (
        <div className="shrink-0 max-w-80 transition-all duration-300 shadow-lg rounded hover:shadow-lg ">
            <div className="w-full h-52 flex justify-center content-center">
                <LazyImage src={imageSrc} alt={title} placeholder={<ScaleLoader color={colors.primary} />} />
            </div>
            <div className="px-2 py-2">
                <p className="font-normal text-base line-clamp-2 h-12">{title}</p>
                {time && (
                    <>
                        <FontAwesomeIcon icon={faCircleQuestion} />
                        <p>{time}</p>
                    </>
                )}
                <div className="mt-2">
                    <div className="text-base flex gap-3">
                        <Popover trigger={'hover'} content={'Câu hỏi'}>
                            <FontAwesomeIcon icon={faCircleQuestion} className="mr-1 text-yellow-500" />
                            <span>{questionCount ?? 0}</span>
                        </Popover>
                        <Popover trigger={'hover'} content={'Lượt truy cập'}>
                            <FontAwesomeIcon icon={faChartSimple} className="mr-1 text-blue-500" />
                            <span>{accessCount ?? 0}</span>
                        </Popover>
                        <Popover trigger={'hover'} content={'Số lượt thi'}>
                            <FontAwesomeIcon icon={faBookOpenReader} className="mr-1 text-green-500" />
                            <span>{examCount ?? 0}</span>
                        </Popover>
                    </div>
                </div>
            </div>
            <div className="px-2 py-2 border-t-2">
                <div className="mt-2">
                    <div className="text-base flex gap-3">
                        <Popover trigger={'hover'} content={'Xem chi tiết'}>
                            <button onClick={() => navigate(`${userDashboardRouter.myQuiz}/${id}`)}>
                                <FontAwesomeIcon icon={faEye} className="pr-1 text-[#f27735]" />
                            </button>
                        </Popover>
                        <Popover trigger={'hover'} content={'Chỉnh sửa đề thi'}>
                            <button onClick={() => navigate(`${userDashboardRouter.myQuiz}/chinh-sua/${id}`)}>
                                <FontAwesomeIcon icon={faEdit} className="pr-1 text-[#851e3f]" />
                            </button>
                        </Popover>
                        {onDelete && (
                            <Popover trigger={'hover'} content={'Xóa đề thi'}>
                                <button onClick={onDelete}>
                                    <FontAwesomeIcon icon={faTrashCan} className="pr-1 text-red-500" />
                                </button>
                            </Popover>
                        )}
                    </div>
                </div>
            </div>
            <div className="px-3 py-3 border-t-2">
                <Link
                    to={`/review-quiz/${slug}`}
                    className="inline-block rounded border hover:text-white hover:opacity-80 ease-linear transition-all duration-200 text-white bg-gradient-to-r from-primary to-[#1e998c] px-2 py-2"
                >
                    <FontAwesomeIcon icon={faPlayCircle} className="pr-1" />
                    Vào ôn thi
                </Link>
            </div>
        </div>
    );
};
export default memo(QuizCard);
