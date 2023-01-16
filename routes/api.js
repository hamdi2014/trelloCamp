const express = require('express');
const router = express.Router();
const userRouter = require('./users/users');
const taskRouter = require('./tasks/tasks');
const authRouter = require('./auth/auth');
const auth=require('../tools/auth');

router.use('/users',auth.checkJWTMiddleware,userRouter);
router.use('/tasks',auth.checkJWTMiddleware,taskRouter);
router.use('/authentication', authRouter);

module.exports = router;