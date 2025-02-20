import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as QuizService from '~/services/quiz.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleInfo,
    faClipboard,
    faPlus,
    faPlusCircle,
    faQuestionCircle,
    faReply,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { educationLevels, imageQuizThumbDefault } from '~/constants';
import UploadComponent from '~/components/UploadComponent';
import { Input, message, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { faSave, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import useMutationHooks from '~/hooks/useMutationHooks';
import JoditEditor from 'jodit-react';
import CreateQuizPart from '~/components/CreateQuizPartCmp';
import BlurBackground from '~/components/BlurBackground';
import { useQuery } from '@tanstack/react-query';
import LazyImage from '~/components/LazyImage';

const QuizDetailContext = createContext();
const SetQuizDetailContext = createContext();
const QuizDetailProvider = ({ children }) => {
    const { id } = useParams(); // id từ param url
    const [quizDetail, setQuizDetail] = useState({});
    const handleGetQuizDetail = async () => {
        const quiz = await QuizService.getQuizDetail(id);
        if (quiz) {
            setQuizDetail(quiz);
            return quiz;
        }
        return {};
    };
    const getQuizQuery = useQuery({ queryKey: [''], queryFn: handleGetQuizDetail });
    useEffect(() => {
        if (getQuizQuery.isError) {
            message.error('Lỗi!, không tìm thấy đề thi');
        }
    }, [getQuizQuery.isError]);
    return (
        <QuizDetailContext.Provider value={quizDetail}>
            <SetQuizDetailContext.Provider value={setQuizDetail}>{children}</SetQuizDetailContext.Provider>
        </QuizDetailContext.Provider>
    );
};
// region general info tab
const date = new Date();
const EditGeneralInformationTab = () => {
    const quizDetail = useContext(QuizDetailContext);
    const [imageUrl, setImageUrl] = useState(''); //Anh base64
    const [quizName, setQuizName] = useState('');
    const [quizDesc, setQuizDesc] = useState('');
    const [quizSchool, setQuizSchool] = useState();
    const [quizSubject, setQuizSubject] = useState('');

    const [quizTopic, setQuizTopic] = useState('');
    const [quizSchoolYear, setQuizSchoolYear] = useState(date.getFullYear());
    const [quizEducationLevel, setQuizEducationLevel] = useState([]);

    const refQuizName = useRef();
    const refQuizDesc = useRef();
    const refQuizSchool = useRef();
    const refQuizSubject = useRef();
    const handleChangeImage = useCallback(
        (url) => {
            setImageUrl(url);
        },
        [imageUrl],
    );
    const updateQuizGeneralMutation = useMutationHooks((data) => QuizService.updateQuizGeneralInfo(data));
    const handleUpdateQuizGeneralInfo = () => {
        if (!quizName || !quizSchool || !quizSubject || !quizDesc || !quizDetail._id) {
            return message.error('Vui lòng kiểm tra lại thông tin');
        }
        updateQuizGeneralMutation.mutate({
            id: quizDetail._id,
            name: quizName,
            desc: quizDesc,
            subject: quizSubject,
            school: quizSchool,
            thumb: imageUrl,
            topic: quizTopic,
            schoolYear: quizSchoolYear,
            educationLevel: quizEducationLevel,
        });
    };
    useEffect(() => {
        setImageUrl(quizDetail?.thumb);
        setQuizName(quizDetail?.name);
        setQuizDesc(quizDetail?.description);
        setQuizSchool(quizDetail?.school);
        setQuizSubject(quizDetail?.subject);
        setQuizEducationLevel(quizDetail?.educationLevel);
        setQuizTopic(quizDetail?.topic);
        setQuizSchoolYear(quizDetail?.schoolYear);
    }, [quizDetail]);
    useEffect(() => {
        if (updateQuizGeneralMutation.isSuccess) {
            message.success('Cập nhật thông tin chung bài trắc nghiệm thành công');
        } else if (updateQuizGeneralMutation.isError) {
            message.error('Cập nhật thông tin chung bài trắc nghiệm thất bại');
        }
    }, [updateQuizGeneralMutation.isSuccess, updateQuizGeneralMutation.isError]);
    // END GENERAL INFO
    return (
        <section className="bg-white px-2 rounded">
            <div className="grid grid-flow-col grid-cols-11 gap-4">
                <div className="col-span-4 px-3 py-4 bg-white">
                    <p className="font-semibold pb-2">Ảnh đề thi</p>
                    <UploadComponent setImageUrl={handleChangeImage} imageUrl={imageUrl} />
                    <div className="flex flex-wrap mt-2">
                        {imageQuizThumbDefault.map((imageSrc, index) => (
                            <button
                                key={index}
                                onClick={() => setImageUrl(imageSrc)}
                                className="w-1/2 px-1 py-1 border"
                            >
                                <LazyImage src={imageSrc} alt="image-default" className="w-full- h-full" />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="col-span-7 flex flex-col gap-4 px-6 py-4 bg-white">
                    <div className="flex flex-col focus-within:text-primary">
                        <div className="mb-2">
                            <label htmlFor="quizName" className="font-semibold">
                                Tên đề thi
                            </label>
                        </div>
                        <Input
                            value={quizName}
                            onChange={(e) => {
                                setQuizName(e.target.value);
                                refQuizName.current.textContent = '';
                            }}
                            autoComplete="off"
                            placeholder="Tên đề thi"
                            type="text"
                            className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                        ></Input>
                        <span className="text-sm text-red-600" ref={refQuizName}></span>
                    </div>
                    <div className="columns-2 gap-4 focus-within:text-primary">
                        <div className="flex flex-col focus-within:text-primary">
                            <div className="mb-2">
                                <label htmlFor="quizSchool" className="font-semibold">
                                    Trường học
                                </label>
                            </div>
                            <Input
                                onChange={(e) => setQuizSchool(e.target.value)}
                                value={quizSchool}
                                className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                                placeholder={'Tên trường học'}
                            ></Input>
                            <span className="text-sm text-red-600" ref={refQuizSchool}></span>
                        </div>
                        <div className="flex flex-col focus-within:text-primary">
                            <div className="mb-2">
                                <label htmlFor="quizSubject" className="font-semibold">
                                    Tên môn học
                                </label>
                            </div>
                            <Input
                                value={quizSubject}
                                onChange={(e) => {
                                    setQuizSubject(e.target.value);
                                    refQuizSubject.current.textContent = '';
                                }}
                                autoComplete="off"
                                placeholder="Tên môn học"
                                type="text"
                                className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                            ></Input>
                            <span className="text-sm text-red-600" ref={refQuizSubject}></span>
                        </div>
                    </div>
                    <div className="flex flex-col focus-within:text-primary">
                        <div className="mb-2">
                            <label htmlFor="quizSubject" className="font-semibold">
                                Trình độ
                            </label>
                        </div>
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="Please select"
                            value={quizEducationLevel}
                            onChange={(e) => setQuizEducationLevel(e)}
                        >
                            {educationLevels?.map((level, index) => (
                                <Select.Option value={level} key={index}>
                                    {level}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                    <div className="columns-2 gap-4">
                        <div className="flex flex-col focus-within:text-primary">
                            <div className="flex flex-col focus-within:text-primary">
                                <div className="mb-2">
                                    <label htmlFor="quizSchool" className="font-semibold">
                                        Năm học
                                    </label>
                                </div>
                                <Input
                                    onChange={(e) => setQuizSchoolYear(e.target.value)}
                                    value={quizSchoolYear}
                                    className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                                    placeholder="Năm học"
                                ></Input>
                            </div>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="quizName" className="font-semibold">
                                Chủ đề bài thi
                            </label>
                        </div>
                        <Input
                            value={quizTopic}
                            onChange={(e) => {
                                setQuizTopic(e.target.value);
                            }}
                            autoComplete="off"
                            placeholder="Chủ đề bài thi"
                            type="text"
                            className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                        ></Input>
                    </div>
                    <div className="flex flex-col focus-within:text-primary">
                        <div className="mb-2">
                            <label htmlFor="quizDescription" className="font-semibold">
                                Mô tả đề thi
                            </label>
                        </div>
                        <TextArea
                            onInput={(e) => {
                                setQuizDesc(e.target.value);
                                refQuizDesc.current.textContent = '';
                            }}
                            value={quizDesc}
                            rows={4}
                            autoComplete="off"
                            placeholder="Mô tả"
                            className="px-3 py-1 shadow-sm rounded-md border-2 outline-primary caret-primary"
                        ></TextArea>
                        <span className="text-sm text-red-600" ref={refQuizDesc}></span>
                    </div>
                </div>
            </div>
            <div className="mt-4 w-full flex justify-end bg-white py-3 px-4 rounded shadow-sm">
                <button
                    onClick={handleUpdateQuizGeneralInfo}
                    disabled={updateQuizGeneralMutation.isPending}
                    className="bg-primary px-3 py-2 text-lg text-white rounded transition-all hover:opacity-70 duration-300"
                >
                    {updateQuizGeneralMutation.isPending ? (
                        <LoadingOutlined className="mr-1" />
                    ) : (
                        <FontAwesomeIcon icon={faSave} className="mr-1" />
                    )}
                    Lưu
                </button>
            </div>
        </section>
    );
};
// region quiz tab
const EditQuestionQuizTab = () => {
    const quizDetail = useContext(QuizDetailContext);
    const setQuizDetail = useContext(SetQuizDetailContext);
    //QUIZ INFORMATION
    // Xử lý lưu thông tin câu hỏi
    const [isActiveQuizPartNameDialog, setIsActiveQuizPartNameDialog] = useState(false);
    const [currentPartIndex, setCurrentPartIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    //Xử lý click chuyển phần thi
    const handleChangePartIndex = (index) => {
        setCurrentPartIndex(index);
        if (quizDetail.quiz[index]) {
            setCurrentQuestionIndex(0);
        }
    };
    const handleAddQuizPart = (quizPartName) => {
        setQuizDetail((preQuizDetail) => {
            preQuizDetail = { ...preQuizDetail };
            preQuizDetail.quiz.push({
                partName: quizPartName,
                questions: [
                    {
                        questionType: 1,
                        questionContent: '',
                        answers: [
                            {
                                content: '',
                                isCorrect: true,
                            },
                            {
                                content: '',
                                isCorrect: false,
                            },
                            {
                                content: '',
                                isCorrect: false,
                            },
                            {
                                content: '',
                                isCorrect: false,
                            },
                        ],
                    },
                ],
            });
            return preQuizDetail;
        });
        setCurrentQuestionIndex(0);
        setCurrentPartIndex(quizDetail.quiz.length - 1);
    };
    //Xử lý click thay đổi câu hỏi
    const handleChangeQuestionIndex = (index) => {
        setCurrentQuestionIndex(index);
    };
    //Xử lý thay đổi nội dung câu hỏi
    const handleChangeQuestionContent = (text) => {
        setQuizDetail((preQuizDetail) => {
            preQuizDetail = { ...preQuizDetail };
            preQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex].questionContent = text;
            return preQuizDetail;
        });
    };
    //Xử lý thay đổi loại câu hỏi
    const handleChangeQuestionType = (type) => {
        setQuizDetail((preQuizDetail) => {
            preQuizDetail = { ...preQuizDetail };
            preQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex].questionType = type;
            return preQuizDetail;
        });
    };
    //Xử lý thêm câu h��i
    const handleAddQuestion = () => {
        setQuizDetail((preQuizDetail) => {
            preQuizDetail = { ...preQuizDetail };
            if (preQuizDetail.quiz[currentPartIndex]) {
                preQuizDetail.quiz[currentPartIndex].questions.push({
                    questionType: 1,
                    questionContent: '',
                    answers: [
                        {
                            content: '',
                            isCorrect: true,
                        },
                        {
                            content: '',
                            isCorrect: false,
                        },
                        {
                            content: '',
                            isCorrect: false,
                        },
                        {
                            content: '',
                            isCorrect: false,
                        },
                    ],
                });
            } else {
                message.error('Lỗi! Bạn phải thêm phần thi trước khi thêm câu hỏi mới');
            }
            return preQuizDetail;
        });
        setCurrentQuestionIndex(quizDetail?.quiz[currentPartIndex]?.questions?.length);
    };
    const handleRemoveQuizPart = (index) => {
        if (quizDetail?.quiz[index]) {
            setQuizDetail((preQuizDetail) => {
                preQuizDetail = { ...preQuizDetail };
                preQuizDetail.quiz.splice(index, 1);
                return preQuizDetail;
            });
        }
    };
    //Xử lý xóa câu hỏi
    const handleRemoveQuestion = () => {
        if (quizDetail.quiz) {
            setQuizDetail((preQuizDetail) => {
                preQuizDetail = { ...preQuizDetail };
                preQuizDetail?.quiz[currentPartIndex]?.questions?.splice(currentQuestionIndex, 1);
                return preQuizDetail;
            });
            if (quizDetail.quiz[currentPartIndex]?.questions?.length - 1 > 0) {
                setCurrentQuestionIndex((prevQuestionIndex) => {
                    if (prevQuestionIndex === 0) {
                        return 0;
                    } else {
                        return prevQuestionIndex - 1;
                    }
                });
            } else {
                handleRemoveQuizPart(currentPartIndex);
                setCurrentPartIndex((prevPartIndex) => {
                    if (prevPartIndex === 0) {
                        return 0;
                    } else {
                        return prevPartIndex - 1;
                    }
                });
                setCurrentQuestionIndex(0);
            }
        }
    };
    //Xử lý thêm đáp án
    const handleAddAnswer = () => {
        if (quizDetail) {
            setQuizDetail((preQuizDetail) => {
                preQuizDetail = { ...preQuizDetail };
                preQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex].answers.push({
                    content: '',
                    isCorrect: false,
                });
                return preQuizDetail;
            });
        }
    };
    //Xử lý xóa đáp án
    const handleRemoveAnswers = (index) => {
        setQuizDetail((preQuizDetail) => {
            preQuizDetail = { ...preQuizDetail };
            preQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex].answers.splice(index, 1);
            return preQuizDetail;
        });
    };
    //Xử lý thay đổi đáp án
    const handleChangeAnswer = (text, index) => {
        setQuizDetail((preQuizDetail) => {
            preQuizDetail = { ...preQuizDetail };
            preQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex].answers[index].content = text;
            return preQuizDetail;
        });
    };
    const handleChangeSingleChoice = (index) => {
        setQuizDetail((preQuizDetail) => {
            preQuizDetail = { ...preQuizDetail };
            preQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex].answers.forEach((answer) => {
                answer.isCorrect = false;
            });
            preQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex].answers[index].isCorrect = true;
            return preQuizDetail;
        });
    };
    const handleChangeMultipleChoice = (index) => {
        setQuizDetail((preQuizDetail) => {
            preQuizDetail = { ...preQuizDetail };
            preQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex].answers[index].isCorrect =
                !preQuizDetail.quiz[currentPartIndex].questions[currentQuestionIndex].answers[index].isCorrect;
            return preQuizDetail;
        });
    };
    //END

    // update quiz question handling mutation
    const updateQuizQuestionMutation = useMutationHooks((data) => QuizService.updateQuizQuestion(data));
    const handleUpdateQuizQuestion = () => {
        if (quizDetail?.quiz) {
            if (quizDetail.quiz.length) {
                updateQuizQuestionMutation.mutate({ id: quizDetail._id, quiz: quizDetail.quiz });
            }
        }
    };
    useEffect(() => {
        if (updateQuizQuestionMutation.isSuccess) {
            message.success('Sửa các câu hỏi trắc nghiệm thành công');
            window.scrollTo({
                top: 140,
                behavior: 'smooth',
            });
        } else if (updateQuizQuestionMutation.isError) {
            message.error(updateQuizQuestionMutation.error.message);
        }
    }, [updateQuizQuestionMutation.isError, updateQuizQuestionMutation.isSuccess]);
    ///TAB
    return (
        <>
            <section className="w-full flex md:flex-row sm:flex-col gap-5">
                <div className="md:w-2/5 sm:w-full">
                    <div className="bg-white shadow-sm px-3 py-3 border rounded-md w-full">
                        <div className="flex justify-between">
                            <h5 className="pb-2">Phần thi</h5>
                            <button
                                className="outline-primary border-primary bg-primary rounded-md border-2 px-3 duration-300 transition-all hover:opacity-50"
                                onClick={() => setIsActiveQuizPartNameDialog(true)}
                            >
                                <p className="text-primary font-bold">
                                    <FontAwesomeIcon icon={faPlus} className="text-white" />
                                </p>
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {quizDetail?.quiz &&
                                quizDetail.quiz.map((partDetail, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleChangePartIndex(index)}
                                        className={`${
                                            currentPartIndex === index
                                                ? 'bg-primary border-primary text-white'
                                                : 'border-gray-400 text-gray-700'
                                        } px-3 py-2 rounded-md border-2 transition-all duration-300`}
                                    >
                                        {partDetail.partName}
                                    </button>
                                ))}
                        </div>
                    </div>
                    <CreateQuizPart
                        callback={(quizPartName) => handleAddQuizPart(quizPartName)}
                        isActiveQuizPartNameDialog={isActiveQuizPartNameDialog}
                        setIsActiveQuizPartNameDialog={setIsActiveQuizPartNameDialog}
                    />
                    <div className="bg-white shadow-sm px-3 py-3 border rounded-md w-full mt-5">
                        <div className="flex justify-between">
                            <h5 className="pb-2">Câu hỏi</h5>
                            <button
                                onClick={handleAddQuestion}
                                className="outline-primary border-primary bg-primary rounded-md border-2 px-3 duration-300 transition-all hover:opacity-50"
                            >
                                <p className="text-primary font-bold">
                                    <FontAwesomeIcon icon={faPlus} className="text-white" />
                                </p>
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-4">
                            {quizDetail.quiz &&
                                quizDetail?.quiz[currentPartIndex]?.questions.map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleChangeQuestionIndex(index)}
                                        className={`${
                                            currentQuestionIndex === index
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white  border-gray-400 text-gray-700 '
                                        } hover:opacity-75 w-12 px-3 py-2 border-2 rounded-md duration-200 transition-all font-semibold`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                        </div>
                    </div>
                    <div className="mt-4 w-full flex justify-end bg-white py-3 px-4 rounded shadow-sm">
                        <button
                            onClick={handleUpdateQuizQuestion}
                            className="bg-primary px-4 py-2 text-white rounded transition-all hover:opacity-70 duration-300"
                        >
                            {updateQuizQuestionMutation.isPending ? (
                                <LoadingOutlined className="mr-1" />
                            ) : (
                                <FontAwesomeIcon icon={faSave} className="mr-1" />
                            )}
                            Lưu
                        </button>
                    </div>
                </div>
                {quizDetail?.quiz?.length > 0 && (
                    <div className="md:flex-1 bg-white px-3 py-3 shadow-sm sm:w-full">
                        <div className="flex justify-between">
                            <div className="flex flex-col">
                                <div className="mb-2">
                                    <label htmlFor="questionType" className="font-semibold">
                                        Loại câu hỏi
                                    </label>
                                </div>
                                <div>
                                    <select
                                        id="questionType"
                                        className="sm:w-full lg:w-56 px-2 py-2 border-2 rounded-lg outline-primary"
                                        value={
                                            quizDetail.quiz &&
                                            quizDetail?.quiz[currentPartIndex]?.questions[currentQuestionIndex]
                                                ?.questionType
                                        }
                                        onChange={(e) => handleChangeQuestionType(e.target.value)}
                                    >
                                        <option value={1}>Một đáp án</option>
                                        <option value={2}>Nhiều đáp án</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <button
                                    onClick={handleRemoveQuestion}
                                    className="border-red-600 text-white bg-red-600 border-2 rounded-lg px-2 py-1  duration-300 transition-all hover:opacity-50"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                                    Xóa câu hỏi
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col mt-3">
                            <div className="mb-2">
                                <label className="font-semibold">Soạn câu hỏi</label>
                            </div>
                            <JoditEditor
                                config={{
                                    placeholder: 'Nhập câu hỏi',
                                    askBeforePasteHTML: false,
                                    defaultActionOnPaste: 'insert_only_text',
                                }}
                                value={
                                    quizDetail?.quiz &&
                                    quizDetail?.quiz[currentPartIndex]?.questions[currentQuestionIndex]?.questionContent
                                }
                                onBlur={(text) => handleChangeQuestionContent(text)} // preferred to use only this option to update the content for performance reasons
                                //onChange={setQuestionContent}
                            />
                        </div>
                        <div className="flex flex-col mt-3">
                            <div>
                                <p className="font-semibold">Câu trả lời</p>
                            </div>
                            {quizDetail.quiz &&
                                quizDetail.quiz[currentPartIndex]?.questions[currentQuestionIndex]?.answers.map(
                                    (answer, index) => (
                                        <div key={index} className="flex flex-col mt-4">
                                            <div className="flex justify-between content-center">
                                                <div className="flex">
                                                    {quizDetail.quiz &&
                                                    quizDetail.quiz[currentPartIndex].questions[currentQuestionIndex]
                                                        .questionType == 1 ? (
                                                        <input
                                                            name="isCorrect"
                                                            checked={answer.isCorrect}
                                                            onChange={(e) => handleChangeSingleChoice(index)}
                                                            type="radio"
                                                            className="mr-2"
                                                            id={`${'answer' + index}`}
                                                        />
                                                    ) : (
                                                        <input
                                                            name="isCorrect"
                                                            checked={answer.isCorrect}
                                                            onChange={(e) => handleChangeMultipleChoice(index)}
                                                            type="checkbox"
                                                            className="mr-2"
                                                            id={`${'answer' + index}`}
                                                        />
                                                    )}
                                                    <label
                                                        htmlFor={`${'answer' + index}`}
                                                        className="flex-wrap content-center"
                                                    >
                                                        Đáp án {`${index + 1}`}
                                                    </label>
                                                </div>
                                                <button onClick={() => handleRemoveAnswers(index)}>
                                                    <p className="text-red-600">
                                                        <FontAwesomeIcon className="mr-1" icon={faTrash} />
                                                        Xóa đáp án
                                                    </p>
                                                </button>
                                            </div>
                                            <JoditEditor
                                                config={{
                                                    placeholder: 'Nhập câu hỏi',
                                                    askBeforePasteHTML: false,
                                                    defaultActionOnPaste: 'insert_only_text',
                                                }}
                                                className="mt-2"
                                                value={answer.content}
                                                onBlur={(newContent) => handleChangeAnswer(newContent, index)} // preferred to use only this option to update the content for performance reasons
                                            />
                                        </div>
                                    ),
                                )}
                        </div>
                        <button
                            onClick={handleAddAnswer}
                            className={'w-full py-3 rounded-md border-4 mt-4 border-dashed border-primary'}
                        >
                            <span className="text-primary font-bold">
                                <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                                Thêm đáp án
                            </span>
                        </button>
                    </div>
                )}
            </section>
            <BlurBackground isActive={isActiveQuizPartNameDialog} />
        </>
    );
};
//region detail
const EditDetailInformationTab = () => {
    const quizDetail = useContext(QuizDetailContext);
    const [topic, setTopic] = useState('');
    const [schoolYear, setSchoolYear] = useState(date.getFullYear());
    const [educationLevel, setEducationLevel] = useState('');
    return (
        <section className="w-full bg-white shadow px-3">
            <div className="col-span-7 flex flex-col gap-4 px-6 py-4 bg-white"></div>
        </section>
    );
};
// region Main page
const EditMyQuizPage = () => {
    const navigate = useNavigate();
    const [currentKey, setCurrentKey] = useState(1); // key của tabs
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);
    const tabs = [
        {
            key: 1,
            label: 'Thông tin chung',
            icon: faCircleInfo,
        },
        {
            key: 2,
            label: 'Các câu hỏi',
            icon: faQuestionCircle,
        },
        {
            key: 3,
            label: 'Nâng cao',
            icon: faClipboard,
        },
    ];
    const tabItems = {
        1: <EditGeneralInformationTab />,
        2: <EditQuestionQuizTab />,
        3: <EditDetailInformationTab />,
    };

    return (
        <QuizDetailProvider>
            <div className="ml-2 py-2 flex justify-between">
                <h4 className="font-semibold">Chỉnh sửa đề thi</h4>
                <button className="bg-red-500 text-white rounded-lg px-2" onClick={() => navigate(-1)}>
                    <FontAwesomeIcon className="mr-1" icon={faReply} />
                    Trở lại
                </button>
            </div>
            <div className="w-full bg-white px-5 py-5 rounded-md shadow-sm">
                <div className="flex gap-9">
                    {tabs.map((item, index) => (
                        <div
                            key={item.key}
                            className={`${
                                currentKey === item.key
                                    ? 'border-b-4 border-b-primary text-primary cursor-default'
                                    : 'hover:opacity-50 cursor-pointer border-b-4 border-b-white'
                            } flex flex-wrap items-center text-lg pb-2 px-1 transition-all duration-200 ease-linear text-gray-700`}
                            onClick={() => setCurrentKey(item.key)}
                        >
                            <FontAwesomeIcon className="block" icon={item.icon} />
                            <p className="pl-2">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-9 w-full">{tabItems[currentKey] ?? <></>}</div>{' '}
            {/* <BlurBackground isActive={isActiveQuizPartNameDialog} /> */}
        </QuizDetailProvider>
    );
};

export default EditMyQuizPage;
