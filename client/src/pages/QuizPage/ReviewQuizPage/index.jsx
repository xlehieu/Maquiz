import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HTMLReactParser from 'html-react-parser';
import useMutationHooks from '~/hooks/useMutationHooks';
import * as QuizService from '~/services/quiz.service';
import { faBookOpen, faStar } from '@fortawesome/free-solid-svg-icons';
import GeneralInformation from './GeneralInformation';
import { questionTypeContent } from '~/constants';
import LoadingComponent from '~/components/LoadingComponent';
import { useQuery } from '@tanstack/react-query';
const ReviewQuizPage = () => {
    const { slug } = useParams();
    const queryQuizDetail = useQuery({
        queryKey: ['QueryQuizPreviewBySlug', slug],
        queryFn: () => QuizService.getQuizPreviewBySlug(slug),
    });
    const [currentTabIndex, setCurrentTabIndex] = useState(1);
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    useEffect(() => {
        document.title = queryQuizDetail?.data?.name || 'Maquiz';
    }, [queryQuizDetail.data]);
    useEffect(() => {
        if (queryQuizDetail?.isError) {
            message.error(queryQuizDetail.error.message);
        }
    }, [queryQuizDetail.isError]);
    const tabButtons = [
        {
            key: 1,
            label: 'Nội dung đề thi',
            icon: faBookOpen,
        },
        {
            key: 2,
            label: 'Đánh giá',
            icon: faStar,
        },
    ];
    const tabs = {
        1: (
            <>
                {queryQuizDetail?.data?.quiz && (
                    <>
                        <div className="scrollbar-thumb-white scrollbar-track-white">
                            <div className="flex gap-5 overflow-scroll scrollbar-thin pb-4">
                                {queryQuizDetail?.data?.quiz.map((part, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPartIndex(index)}
                                        className={`rounded-3xl px-4 py-2 whitespace-nowrap ${
                                            currentPartIndex == index
                                                ? 'bg-primary border-primary text-white'
                                                : 'border-gray-600 text-gray-600'
                                        }`}
                                    >
                                        {part?.partName}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            {queryQuizDetail?.data?.quiz[currentPartIndex]?.questions instanceof Array && (
                                <div className="relative">
                                    {queryQuizDetail?.data?.quiz[currentPartIndex]?.questions?.length <= 5 ? (
                                        <div className="mt-2 h-96 overflow-scroll">
                                            {queryQuizDetail?.data?.quiz[currentPartIndex]?.questions?.map(
                                                (question, index) => (
                                                    <div className="mt-3" key={index}>
                                                        <div className="flex flex-wrap">
                                                            {HTMLReactParser(question?.questionContent)}{' '}
                                                            <p className="ml-1">
                                                                ({questionTypeContent[question?.questionType]})
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-wrap flex-col">
                                                            {question?.answers &&
                                                                question?.answers.map((answer, index) => (
                                                                    <div key={index}>
                                                                        {HTMLReactParser(answer.content)}
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <div className="mt-2 h-96 overflow-scroll">
                                            {queryQuizDetail?.data?.quiz[currentPartIndex]?.questions
                                                ?.slice(0, 5)
                                                .map((question, index) => (
                                                    <div key={index} className="mt-3">
                                                        <div className="flex flex-wrap">
                                                            {HTMLReactParser(question?.questionContent)}{' '}
                                                            <p className="ml-1">
                                                                ({questionTypeContent[question?.questionType]})
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-wrap flex-col">
                                                            {question?.answers &&
                                                                question?.answers.map((answer, indexAns) => (
                                                                    <div key={indexAns}>
                                                                        {HTMLReactParser(answer.content)}
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                    <div className="absolute w-full px-5 py-2 bottom-0 bg-yellow-500">
                                        <p className="font-bold text-white">
                                            Bạn đang xem ở chế độ xem trước, hãy bắt đầu ôn thi nào!!!
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </>
        ),
        2: <div>Hello2</div>,
    };
    return (
        <div className="w-full">
            {queryQuizDetail.isLoading ? (
                <LoadingComponent />
            ) : (
                <>
                    <GeneralInformation quizDetail={queryQuizDetail.data} />
                    <div className="px-2 py-2 mt-5 rounded shadow-md border bg-white">
                        <div className="flex gap-3 flex-wrap">
                            {tabButtons.map((tabButton) => (
                                <button
                                    key={tabButton.key}
                                    className={`${
                                        currentTabIndex === tabButton.key
                                            ? 'border-b-4 border-b-primary text-primary cursor-default'
                                            : 'hover:opacity-50 cursor-pointer border-b-4 border-b-white'
                                    } flex flex-wrap tabButtons-center text-lg pb-2 px-1 transition-all duration-200 ease-linear text-gray-500 items-center`}
                                    onClick={() => setCurrentTabIndex(tabButton.key)}
                                >
                                    <FontAwesomeIcon className="block" icon={tabButton.icon} />
                                    <p className="pl-2">{tabButton.label}</p>
                                </button>
                            ))}
                        </div>
                        <div className="mt-6">{tabs[currentTabIndex]}</div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ReviewQuizPage;
