import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    quiz: [],
};
export const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        setQuiz: (state, action) => {
            state.quiz = action.payload;
        },
        deleteOneQuiz: (state, action) => {
            state.quiz = state.quiz.filter((q) => q.id !== action.payload.id);
        },
    },
});
export const { setQuiz, deleteOneQuiz } = quizSlice.actions;
export default quizSlice.reducer;
