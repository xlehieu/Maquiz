import productRouter from './product.router';
import userRouter from './user.router';
import quizRouter from './quiz.router';
import classroomRouter from './classroom.router';
const routes = function (app: any) {
    app.use('/api/product', productRouter);
    app.use('/api/user', userRouter);
    app.use('/api/quiz', quizRouter);
    app.use('/api/classroom', classroomRouter);
};
export default routes;
