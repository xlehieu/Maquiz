import { faPlus, faReply } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import { Input, message } from 'antd';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '~/components/Modal';
import useMutationHooks from '~/hooks/useMutationHooks';
import * as ClassroomService from '~/services/classroom.service';
import { LoadingOutlined } from '@ant-design/icons';
import { userDashboardRouter } from '~/config';
import { useQuery } from '@tanstack/react-query';
import LazyImage from '~/components/LazyImage';
import { classroomImageFallback } from '~/constants';
const CreateClassroomContext = createContext();
const ModalContext = createContext();
const ClassroomListContext = createContext();
const EnrollInClassroomContext = createContext();
const ModalProvider = ({ children }) => {
    const [isShowModal, setIsShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState('');
    const [contentModal, setContentModal] = useState(<></>);
    const [textHandleModal, setTextHandleModal] = useState('');
    return (
        <ModalContext.Provider
            value={{
                isShowModal,
                setIsShowModal,
                titleModal,
                setTitleModal,
                contentModal,
                setContentModal,
                textHandleModal,
                setTextHandleModal,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};
const CreateClassroomProvider = ({ children }) => {
    const [classroomName, setClassroomName] = useState('');
    const [subjectName, setSubjectName] = useState('');

    return (
        <CreateClassroomContext.Provider value={{ classroomName, setClassroomName, subjectName, setSubjectName }}>
            {children}
        </CreateClassroomContext.Provider>
    );
};
const ClassroomListProvider = ({ children }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['userClassroom'],
        queryFn: () => ClassroomService.getUserClassrooms(),
        refetchOnWindowFocus: true, // Khi user quay lại tab, tự động fetch lại
    });
    return (
        <ClassroomListContext.Provider value={{ classList: data, isLoadingQuery: isLoading }}>
            {children}
        </ClassroomListContext.Provider>
    );
};
const EnrollInClassroomProvider = ({ children }) => {
    const [classCode, setClassCode] = useState('');
    return (
        <EnrollInClassroomContext.Provider value={{ classCode, setClassCode }}>
            {children}
        </EnrollInClassroomContext.Provider>
    );
};
const ClassroomCard = ({ classroom, isMyClassroom = false }) => {
    return (
        <div className="w-full bg-white transition-all block duration-300 border-2 border-gray-200 rounded-lg overflow-hidden pb-3 hover:drop-shadow-lg relative h-56">
            {classroom?.thumb ? (
                <LazyImage
                    alt={classroom?.name ?? 'classroom image'}
                    src={classroom?.thumb}
                    className="w-full h-20 opacity-60"
                />
            ) : (
                <LazyImage
                    alt={classroom?.name ?? 'classroom image'}
                    src={classroomImageFallback}
                    className="w-full h-20 opacity-60"
                />
            )}
            <div className="relative h-12">
                {classroom?.teacher?.avatar && (
                    <LazyImage
                        alt={classroom?.teacher?.name ?? 'teacher image'}
                        src={classroom?.teacher?.avatar}
                        className="w-12 h-full rounded-full overflow-hidden absolute z-0 -top-1/2 right-3"
                    />
                )}
                {classroom?.name && (
                    <Link
                        to={`${userDashboardRouter.classroom}/${classroom?.classCode}`}
                        className="z-10 text-2xl text-gray-700 font-normal ml-3 line-clamp-1 hover:underline"
                    >
                        {classroom?.name}
                    </Link>
                )}
            </div>
            {!isMyClassroom && classroom?.teacher?.name && (
                <div className="z-10 text-xl md:text-lg absolute bottom-2 text-black font-light ml-3 line-clamp-1">
                    {classroom?.teacher?.name}
                </div>
            )}
        </div>
    );
};
//region Class list component
const ClassroomList = () => {
    const { classList } = useContext(ClassroomListContext);
    return (
        <>
            {classList?.myClassrooms?.length > 0 && (
                <>
                    <div className="flex flex-col items-center justify-center w-full p-4">
                        <h2 className="text-xl font-bold text-gray-600">Lớp học của tôi</h2>
                    </div>
                    <div className="w-full grid gap-3 grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
                        {classList?.myClassrooms?.map((classroom, index) => (
                            <div key={index}>
                                <ClassroomCard isMyClassroom={true} classroom={classroom} />
                            </div>
                        ))}
                    </div>
                </>
            )}
            {classList?.enrolledClassrooms?.length > 0 && (
                <>
                    <div className="flex flex-col items-center justify-center w-full p-4">
                        <h2 className="text-xl font-bold text-gray-600">Lớp học đang tham gia</h2>
                    </div>
                    <div className="w-full grid gap-3 grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
                        {classList?.enrolledClassrooms?.map((classroom, index) => (
                            <div key={index}>
                                <ClassroomCard classroom={classroom} />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};
//region JOIN CLASS ROOM
const EnrolledClassroomContent = () => {
    const navigate = useNavigate();
    const { setIsShowModal } = useContext(ModalContext);
    const { classCode, setClassCode } = useContext(EnrollInClassroomContext);
    const enrollInClassMutation = useMutationHooks((data) => ClassroomService.enrollInClassroom(data));
    const handleClickEnroll = () => {
        if (!classCode?.trim()) return message.error('Vui lòng nhập mã lớp học');
        enrollInClassMutation.mutate({ classCode });
    };
    useEffect(() => {
        if (enrollInClassMutation.isError) {
            message.error(enrollInClassMutation?.error.message);
        } else if (enrollInClassMutation.isSuccess) {
            message.success('Tham gia lớp học thành công');
            navigate(`${userDashboardRouter.classroom}/${classCode}`);
        }
    }, [enrollInClassMutation.isError, enrollInClassMutation.isSuccess]);
    return (
        <div className="flex flex-col w-full">
            {/* ta phải đặt class peer vào phần tử muốn lắng nghe,
         và thêm peer-... vào phần tử muốn thay đổi
         ví dụ phải đặt peer vào input
         và đặt peer-placeholder-shown:top1/2 nghĩa là khi placeholder của input
        được hiển thị thì phần tử có peer-placeholder-shown sẽ được kích hoạt
            và peer chỉ ảnh hưởng đến phần tử anh em (sibling)
         */}
            <div className="relative w-full">
                <input
                    type="text"
                    id="classroomCode"
                    placeholder=" "
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    className="peer w-full border-2 border-gray-300 rounded-md px-4 pt-4 pb-2 text-base outline-none focus:border-primary transition-all"
                />
                <label
                    htmlFor="classroomCode"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-base transition-all cursor-text peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-focus:text-primary bg-white px-1"
                >
                    Mã lớp
                </label>
            </div>
            <div className="border-t flex justify-end pt-3 space-x-2">
                <button onClick={() => setIsShowModal(false)} className="text-blue-500 px-2 py-1 font-semibold">
                    Hủy
                </button>
                <button
                    // disabled={!classCode?.trim()}
                    onClick={handleClickEnroll}
                    className={`${!classCode?.trim() ? 'text-gray-400' : 'text-blue-500'} font-semibold px-2 py-1 `}
                >
                    {enrollInClassMutation.isPending ? <LoadingOutlined /> : 'Tham gia'}
                </button>
            </div>
        </div>
    );
};
//region CREATE CLASS ROOM
const CreateClassroomContent = () => {
    const navigate = useNavigate();
    const { setIsShowModal } = useContext(ModalContext);
    const { classroomName, setClassroomName, subjectName, setSubjectName } = useContext(CreateClassroomContext);
    const createClassroomMutation = useMutationHooks((data) => ClassroomService.createClassroom(data));
    const handleClickCreateClassroomModal = () => {
        if (!classroomName?.trim() || !subjectName?.trim()) {
            return message.warning('Vui lòng điền đầy đủ thông tin');
        } else {
            createClassroomMutation.mutate({ classroomName, subjectName });
        }
    };
    useEffect(() => {
        if (createClassroomMutation.isSuccess) {
            message.success('Tạo lớp học thành công');
            setIsShowModal(false);
            setClassroomName('');
            setSubjectName('');
            navigate(`${userDashboardRouter.classroom}/${createClassroomMutation.data?.classCode}`);
        } else if (createClassroomMutation.isError) {
            message.error('Tạo lớp học thất bại');
        }
    }, [createClassroomMutation.isError, createClassroomMutation.isSuccess]);
    return (
        <div className="flex flex-col w-full">
            <div className="relative w-full">
                <input
                    type="text"
                    id="classroomName"
                    placeholder=" "
                    autoComplete="off"
                    className="peer w-full border-2 border-gray-300 rounded-md px-4 pt-4 pb-2 text-base outline-none focus:border-primary transition-all"
                    value={classroomName}
                    onChange={(e) => setClassroomName(e.target.value)}
                />
                <label
                    htmlFor="classroomName"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-base transition-all cursor-text peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-focus:text-primary bg-white px-1"
                >
                    Tên lớp
                </label>
            </div>
            <div className="relative w-full mt-5">
                <input
                    type="text"
                    id="classroomSubject"
                    placeholder=" "
                    autoComplete="off"
                    className="peer w-full border-2 border-gray-300 rounded-md px-4 pt-4 pb-2 text-base outline-none focus:border-primary transition-all"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                />
                <label
                    htmlFor="classroomSubject"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-base transition-all cursor-text peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-focus:text-primary bg-white px-1"
                >
                    Môn học
                </label>
            </div>
            <div className="border-t flex justify-end pt-3 space-x-2">
                <button onClick={() => setIsShowModal(false)} className="rounded bg-white px-3 py-1 border-2">
                    Hủy
                </button>
                <button
                    disabled={!classroomName?.trim() || !subjectName?.trim()}
                    onClick={handleClickCreateClassroomModal}
                    className={`${
                        !classroomName?.trim() || (!subjectName?.trim() && 'opacity-25')
                    }rounded bg-primary text-white px-3 py-1 border-2`}
                >
                    {createClassroomMutation.isPending ? <LoadingOutlined /> : 'Tạo lớp học'}
                </button>
            </div>
        </div>
    );
};
const modalContents = [
    {
        title: 'Tham gia lớp học',
        content: <EnrolledClassroomContent />,
        textHandleButton: 'Tham gia',
    },
    {
        title: 'Tạo lớp học',
        content: <CreateClassroomContent />,
        textHandleButton: 'Tạo lớp học',
    },
];
const ClassroomsPageMain = () => {
    const {
        isShowModal,
        setIsShowModal,
        titleModal,
        setTitleModal,
        contentModal,
        setContentModal,
        textHandleModal,
        setTextHandleModal,
    } = useContext(ModalContext);
    //truyền props title,content,textButtonHandle từ render vào hàm
    const handleOpenModal = (title, content, textHandleButton) => {
        setTitleModal(title);
        setContentModal(content);
        setTextHandleModal(textHandleButton);
        setIsShowModal(true);
    };

    return (
        <>
            <div className="flex justify-between my-5">
                <h4 className="font-medium text-gray-500">Lớp học</h4>
            </div>
            <section className="w-full min-h-screen bg-white px-8 rounded-xl shadow-lg flex flex-col">
                <div className="w-full border-b flex justify-end">
                    <Tippy
                        interactive={true}
                        hideOnClick="toggle" // Mặc định là true, có thể bỏ đi
                        placement="bottom-end"
                        offset={[10, -10]}
                        content={
                            <div className="flex flex-col shadow-md bg-white" tabIndex="-1">
                                {modalContents.map((modal, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            handleOpenModal(modal.title, modal.content, modal.textHandleButton)
                                        }
                                        className="text-gray-600 duration-200 px-4 py-2 text-left hover:rounded hover:bg-black hover:bg-opacity-5"
                                    >
                                        {modal?.title}
                                    </button>
                                ))}
                            </div>
                        }
                    >
                        <button className="mr-3 px-2 py-2">
                            <FontAwesomeIcon icon={faPlus} className="text-3xl md:text-xl text-gray-500" />
                        </button>
                    </Tippy>
                </div>
                <ClassroomList />
            </section>
            <Modal
                className="w-1/2"
                title={titleModal}
                content={contentModal}
                textButtonHandle={textHandleModal}
                onCancel={() => setIsShowModal(false)}
                bgColorButtonHandle="bg-primary"
                isShow={isShowModal}
                showFooter={false}
            ></Modal>
        </>
    );
};
const ClassroomsPage = () => (
    <ModalProvider>
        <CreateClassroomProvider>
            <ClassroomListProvider>
                <EnrollInClassroomProvider>
                    <ClassroomsPageMain />
                </EnrollInClassroomProvider>
            </ClassroomListProvider>
        </CreateClassroomProvider>
    </ModalProvider>
);
export default ClassroomsPage;
