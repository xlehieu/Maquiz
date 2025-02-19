import { useQuery } from '@tanstack/react-query';
import React, {
    createContext,
    memo,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from 'react';
import * as QuizService from '~/services/quiz.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleQuestion,
    faChartSimple,
    faBookOpenReader,
    faPlayCircle,
    faEye,
    faPlusSquare,
    faEdit,
    faReply,
    faClose,
} from '@fortawesome/free-solid-svg-icons';
import { message, Popover } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import router, { userDashboardRouter } from '~/config';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOneQuiz, setQuiz } from '~/redux/slices/quiz.slice';
import LoadingComponent from '~/components/LoadingComponent';
import LazyImage from '~/components/LazyImage';
import { ScaleLoader } from 'react-spinners';
import { colors } from '~/constants';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import useMutationHooks from '~/hooks/useMutationHooks';
import { LoadingOutlined } from '@ant-design/icons';
import QuizCard from '~/components/QuizCard';
import { handleCountQuestion } from '~/utils';
import Modal from '~/components/Modal';
const QuizzesContext = createContext();
const QuizzesProvider = ({ children }) => {
    const [quizzes, setQuizzes] = useState([]);
    const quizDispatch = useDispatch();
    const quizzesSelector = useSelector((state) => state.quiz);
    const handleGetQuizzes = async () => {
        if (quizzesSelector.quiz.length <= 0) {
            const quizSer = await QuizService.getQuizzes();
            setQuizzes(quizSer);
            quizDispatch(setQuiz(quizSer));
            return quizSer;
        } else {
            if (!(quizzesSelector.quiz === quizzes)) {
                setQuizzes(quizzesSelector.quiz);
            }
            return quizzesSelector;
        }
    };
    const quizQuery = useQuery({ queryKey: [''], queryFn: handleGetQuizzes });
    return (
        <QuizzesContext.Provider value={{ quizzes, setQuizzes }}>
            {quizQuery.isPending ? <LoadingComponent /> : <>{children}</>}
        </QuizzesContext.Provider>
    );
};

const MyQuizPageMain = () => {
    const { quizzes, setQuizzes } = useContext(QuizzesContext);
    const navigate = useNavigate();
    const [isShowModal, setIsShowModal] = useState(false);
    const [deleteQuizId, setDeleteQuizId] = useState(null);
    const dispatch = useDispatch();
    const deleteQuizMutation = useMutationHooks((data) => QuizService.deleteQuiz(data));
    //Hiển thị modal và set id quiz muốn xóa
    const handleDeleteQuizModal = (id) => {
        setIsShowModal(true);
        setDeleteQuizId(id);
    };
    //Hàm xử lý đóng modal
    const handleCancelDeleteQuiz = useCallback(() => {
        setIsShowModal(false);
        setDeleteQuizId(null);
    }, []);
    // Hàm xử lý xóa quiz
    const handleOkDeleteQuiz = useCallback(() => {
        if (deleteQuizId) {
            deleteQuizMutation.mutate({ id: deleteQuizId });
        }
    }, [deleteQuizId]);

    // Khi xóa lỗi hoặc xóa thành công bằng mutation
    useEffect(() => {
        if (deleteQuizMutation.isSuccess && deleteQuizMutation.data) {
            const { id } = deleteQuizMutation.data;
            if (id) {
                dispatch(deleteOneQuiz({ id }));
                setQuizzes((prevQuizzes) => {
                    prevQuizzes = [...prevQuizzes];
                    return prevQuizzes.filter((q) => q._id !== id);
                });
                handleCancelDeleteQuiz();
                message.success('Xóa bài trắc nghiệm thành công');
            } else {
                message.error('Xóa bài trắc nghiệm thất bại, vui lòng thử lại');
            }
        } else if (deleteQuizMutation.isError) {
            message.error('Xóa bài trắc nghiệm thất bại, vui lòng thử lại');
        }
    }, [deleteQuizMutation.isSuccess, deleteQuizMutation.data, deleteQuizMutation.isError]);
    useLayoutEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);
    return (
        <>
            <div className="flex justify-between my-5">
                <h4 className="font-semibold text-gray-500">Danh sách đề thi</h4>
            </div>
            <section className="rounded-xl bg-white px-8 py-8 flex gap-10 flex-wrap shadow">
                <div className="w-full border-b-2 px-9 py-1 flex justify-between">
                    <p className="font-semibold text-xl">
                        <span className="text-primary mr-2">{quizzes ? quizzes.length : 0}</span>
                        <span className="text-slate-600">Đề thi</span>
                    </p>
                    <button
                        onClick={() => navigate(router.createQuiz)}
                        className="px-2 py-1 text-primary font-semibold rounded border-primary border-2 hover:text-primary hover:opacity-55 transition-all duration-200"
                    >
                        <FontAwesomeIcon icon={faPlusSquare} className="mr-1" />
                        Tạo đề thi
                    </button>
                </div>
                <div className="grid w-full h-full grid-cols-2 gap-4 px-0 pb-4 sm:grid-cols-3 md:grid-cols-4  2xl:grid-cols-5">
                    {quizzes?.length > 0
                        ? quizzes.map((quiz, index) => (
                              <QuizCard
                                  key={index}
                                  title={quiz.name}
                                  accessCount={quiz.accessCount}
                                  examCount={quiz.examCount}
                                  questionCount={handleCountQuestion(quiz.quiz)}
                                  imageSrc={quiz.thumb}
                                  id={quiz._id}
                                  slug={quiz.slug}
                                  onDelete={() => handleDeleteQuizModal(quiz._id)}
                              />
                          ))
                        : 'Không thấy đề thi nào 😟😟😟😟'}
                </div>
            </section>
            <Modal
                isShow={isShowModal}
                onCancel={handleCancelDeleteQuiz}
                onLoading={deleteQuizMutation.isPending}
                onOk={handleOkDeleteQuiz}
            />
        </>
    );
};
const MyQuizPage = () => {
    return (
        <QuizzesProvider>
            <MyQuizPageMain />
        </QuizzesProvider>
    );
};
export default MyQuizPage;
