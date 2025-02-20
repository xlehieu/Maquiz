import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import store from './redux/store';
import { Provider } from 'react-redux';
import { message } from 'antd';
import 'antd/dist/antd';
import './index.css';
import App from './App';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
message.config({
    top: 0, // Khoảng cách từ trên xuống (px)
    duration: 3, // Thời gian hiển thị (giây)
    maxCount: 3, // Giới hạn số lượng message hiển thị
    // rtl: true, // Bật chế độ từ phải sang trái (Right-to-Left)
});
root.render(
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <App />
        </Provider>
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>,
);
