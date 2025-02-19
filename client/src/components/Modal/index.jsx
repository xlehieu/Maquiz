import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LoadingOutlined } from '@ant-design/icons';
const Modal = ({
    title = 'Hello',
    content = 'This is modal content',
    onLoading,
    onCancel,
    onOk,
    isShow,
    textButtonHandle = 'Xóa',
    bgColorButtonHandle = 'bg-red-500',
    className = '',
    showFooter = true,
}) => {
    //inset-0 giúp left-0,right-0,top-0,bottom-0
    return (
        <>
            {isShow && (
                <div className="fixed inset-0 z-30">
                    <div
                        onClick={onCancel}
                        className="flex justify-center items-start bg-black bg-opacity-45 min-h-screen"
                    >
                        {/* Modal chính, chặn sự kiện onClick lan ra ngoài */}
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className={`absolute px-5 py-3 top-20 min-w-full md:min-w-96 flex flex-col shadow-lg rounded bg-white ${className}`}
                        >
                            <div className="flex justify-between items-center border-b">
                                <h2 className="font-medium">{title}</h2>
                                <button className="px-2 py-2" onClick={onCancel}>
                                    <FontAwesomeIcon
                                        className="text-2xl md:text-xl font-normal text-gray-400"
                                        icon={faClose}
                                    />
                                </button>
                            </div>
                            <div className="my-6">{content}</div>
                            {showFooter && (
                                <div className="border-t flex justify-end pt-3 space-x-2">
                                    <button onClick={onCancel} className="rounded bg-white px-3 py-1 border-2">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={onOk}
                                        className={`rounded ${bgColorButtonHandle} text-white px-3 py-1 border-2`}
                                    >
                                        {onLoading ? <LoadingOutlined /> : textButtonHandle}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default Modal;
