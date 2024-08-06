import { Router } from "express";
import userRouter from './user.router'
import videoRouter from './video.router'

const router = Router()

router.use('/user', userRouter)
router.use('/video', videoRouter)

export default router