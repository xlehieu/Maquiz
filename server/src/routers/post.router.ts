import express from 'express';
import * as PostController from '@controllers/post.controller';
const postRouter = express.Router();
postRouter.post('/createPost', PostController.createPost);

export default postRouter;
