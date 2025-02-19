import { Router } from 'express';
import { authUserMiddleware } from '@middlewares/auth.middleware';
import * as ClassroomController from '@controllers/classroom.controller';
const classroomRouter = Router();

classroomRouter.post('/createClassroom', authUserMiddleware, ClassroomController.createClassroom);
classroomRouter.get('/getUserClassrooms', authUserMiddleware, ClassroomController.getUserClassrooms);

export default classroomRouter;
