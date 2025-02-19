export const isJsonString = (data) => {
    try {
        JSON.parse(data);
    } catch (err) {
        return false;
    }
    return true;
};
export const showImage = (img) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
    });
};
export function boDau(str) {
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

export const isNumber = (number) => {
    try {
        return !isNaN(number); // isNaN sẽ kiểm tra đầu vào nếu không phải là dạng số sẽ trả ra true
        // và chúng ta đang kiểm tra là số hay không nên để phủ định, nếu là dạng số thì sẽ true
    } catch {
        return false;
    }
};

export const handleCountQuestion = (quiz) => {
    if (quiz?.length > 0) {
        return quiz.reduce((accumulator, partCurrent) => {
            return accumulator + partCurrent?.questions?.length;
        }, 0);
    }
    return 0;
};
