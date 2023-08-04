import express, { Router } from "express";
import { handleCreateUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post('/user/create', handleCreateUser);

export default userRouter;