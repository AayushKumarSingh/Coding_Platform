import express from 'express';
const app = express();

const rootRouter = express.Router();

import submitionRouter from './submition/submition';

rootRouter.use('/submition', submitionRouter);


export default rootRouter;