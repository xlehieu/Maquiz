import productRouter from './product.router';
import userRouter from './user.router';
import quizRouter from './quiz.router';
import classroomRouter from './classroom.router';
import postRouter from './post.router';
const routes = function (app: any) {
    app.use('/api/product', productRouter);
    app.use('/api/user', userRouter);
    app.use('/api/quiz', quizRouter);
    app.use('/api/classroom', classroomRouter);
    app.use('/api/post', postRouter);
};
export default routes;
