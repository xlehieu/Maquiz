import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import JoditEditor from 'jodit-react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingComponent from '~/components/LoadingComponent';
import configEditor from '~/config/editor';
import useMutationHooks from '~/hooks/useMutationHooks';
import * as ClassroomService from '~/services/classroom.service';
const ClassroomContext = createContext();
const ClassroomProvider = ({ children }) => {
    const { classCode } = useParams();
    const queryClassDetail = useQuery({
        queryKey: ['queryClassDetail', classCode],
        queryFn: () => ClassroomService.getClassroomDetail({ classCode }),
    });
    useEffect(() => {
        if (queryClassDetail.isError) {
            message.error(queryClassDetail?.error.message || 'Có lỗi xảy ra');
        }
    }, [queryClassDetail.isError]);
    return (
        <ClassroomContext.Provider value={{ classroom: queryClassDetail.data }}>
            {queryClassDetail.isLoading ? <LoadingComponent /> : <>{children}</>}
        </ClassroomContext.Provider>
    );
};
function hasValidTextInHTML(html) {
    const strippedText = html.replace(/<\/?p>/g, '').trim(); // Xóa thẻ <p> nhưng giữ nội dung
    return strippedText.length > 0;
}
const NewsFeedComponent = () => {
    const { classroom } = useContext(ClassroomContext);
    const [notificationText, setNotificationText] = useState('');
    const uploadPostMutation = useMutationHooks();
    const uploadPost = () => {
        console.log(hasValidTextInHTML(notificationText));
    };
    return (
        <div className="w-full">
            <div className="md:rounded-2xl md:overflow-hidden w-full h-56 relative">
                <img className="w-full h-full object-cover opacity-80" src={classroom?.thumb} alt="class image" />
                <h3 className="absolute bottom-4 left-4 text-4xl font-medium text-white line-clamp-1">
                    {classroom?.name}
                </h3>
            </div>
            <div className="mt-5">
                <div>
                    <JoditEditor
                        config={{ ...configEditor, minHeight: 150, placeholder: 'Thông báo cho lớp học' }}
                        value={notificationText}
                        onBlur={(text) => setNotificationText(text)} // preferred to use only this option to update the content for performance reasons
                        //onChange={setQuestionContent}
                    />
                    <div className="flex justify-end mt-3">
                        <button
                            onClick={uploadPost}
                            className="text-3xl md:text-xl bg-primary text-white rounded px-3 py-1 "
                        >
                            Đăng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
const EveryoneComponent = () => {
    const { classroom } = useContext(ClassroomContext);
    console.log(classroom);
    return (
        <div className="w-full bg-white">
            <div className="w-full">
                <div className="w-full border-b-2">
                    <h3>Giáo viên</h3>
                </div>
                <div>{/* <img src={classroom.}/> */}</div>
            </div>
            {classroom.students.map((student) => {})}
        </div>
    );
};
const tabContents = {
    0: {
        label: 'Bảng tin',
        content: <NewsFeedComponent />,
    },
    1: {
        label: 'Mọi người',
        content: <EveryoneComponent />,
    },
};
const ClassroomDetailMain = () => {
    const [tabKey, setTabKey] = useState(0);
    return (
        <div className="w-full mt-2 md:mt-0 min-h-screen bg-white px-8 py-4 rounded-xl shadow-lg flex flex-col">
            <div className="w-full flex flex-nowrap overflow-scroll gap-4">
                {Object.entries(tabContents).map(([key, value], index) => (
                    <button
                        key={index}
                        className={`border-b-2 px-2 py-1 ${
                            tabKey == key ? 'border-primary' : 'border-white'
                        } transition-all duration-300`}
                        onClick={() => setTabKey(key)}
                    >
                        <span
                            className={`font-medium text-gray-500 ${
                                tabKey == key ? 'text-primary' : ''
                            } transition-all duration-300`}
                        >
                            {value.label}
                        </span>
                    </button>
                ))}
            </div>
            <div className="flex-grow">{tabContents[tabKey]?.content}</div>
        </div>
    );
};
const ClassroomDetail = () => {
    return (
        <ClassroomProvider>
            <ClassroomDetailMain />
        </ClassroomProvider>
    );
};
export default ClassroomDetail;
