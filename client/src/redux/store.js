import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counter.slice';
import productReducer from './slices/product.slice';
import userReducer from './slices/user.slice';
import quizReducer from './slices/quiz.slice';
export default configureStore({
    reducer: {
        counter: counterReducer,
        user: userReducer,
        products: productReducer,
        quiz: quizReducer,
    },
});
