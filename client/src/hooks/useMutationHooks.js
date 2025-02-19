import { useMutation } from '@tanstack/react-query';

//mutation giúp ta quản lý các trạng thái khi call api, ví dụ như loading thì chúng ta có thể hiển thị icon loading ở button
const useMutationHooks = (callback) => {
    const mutaion = useMutation({
        mutationFn: callback,
    });
    return mutaion;
};

export default useMutationHooks;
