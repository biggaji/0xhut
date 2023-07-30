import express, { Router } from "express";
import { handleCreateUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post('/create/user', handleCreateUser);

export default userRouter;