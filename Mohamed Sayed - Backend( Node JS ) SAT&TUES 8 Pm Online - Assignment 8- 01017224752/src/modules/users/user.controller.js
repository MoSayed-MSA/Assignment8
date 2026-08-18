import { Router } from "express";
import * as US from "./user.service.js";
import { Authenticate } from "../../middleware/auth.js";

const userRouter = Router()

userRouter.get('/profile', Authenticate, US.getUserData)

userRouter.post('/signup', US.signUp)
userRouter.post('/login', US.logIn)


userRouter.patch('/update', Authenticate, US.updateUser)

userRouter.delete('/delete', Authenticate, US.deleteUser)


export default userRouter