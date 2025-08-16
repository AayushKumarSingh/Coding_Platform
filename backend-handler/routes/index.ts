import express from 'express';
const app = express();

const rootRouter = express.Router();


import submitionRouter from './submition/submition';
import questionpullRouter from './Questions/questionpull';

rootRouter.use('/submition', submitionRouter);
rootRouter.use('/questions', questionpullRouter);




export default rootRouter;