import express from 'express';
import * as QuizController from '@controllers/quiz.controller';
import { authUserMiddleware } from '@middlewares/auth.middleware';
const quizRouter = express.Router();
// Authentication required
quizRouter.post('/create', authUserMiddleware, QuizController.createQuiz);
quizRouter.put('/createQuestion', authUserMiddleware, QuizController.createQuestion);
quizRouter.get('/getQuizzes', authUserMiddleware, QuizController.getQuizzes);
quizRouter.put('/updateQuizGeneralInfo', authUserMiddleware, QuizController.updateQuizGeneralInfo);
quizRouter.get('/getQuizDetail', authUserMiddleware, QuizController.getQuizDetail);
quizRouter.put('/updateQuizQuestion', authUserMiddleware, QuizController.updateQuizQuestion);
quizRouter.delete('/deleteQuiz/:id', authUserMiddleware, QuizController.deleteQuiz);
quizRouter.get('/getQuizForExam/:slug', authUserMiddleware, QuizController.getQuizForExam);
// No authentication required
quizRouter.get('/getQuizPreview/:slug', QuizController.getQuizPreview);
quizRouter.get('/getDiscoveryQuizzes', QuizController.getDiscoveryQuizzes);
export default quizRouter;
