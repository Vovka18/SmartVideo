import { Router } from "express"
import { UserController } from "../controllers/user.controller"
import checkAuth from "../middleware/chekAuth"
import chekToken from "../middleware/chekToken"

const router = Router()

router.post('/registration', UserController.reg)
router.post('/verification', UserController.verification)
router.post('/auth', UserController.auth)
router.get('/refreshToken', chekToken, UserController.refreshToken)
router.post('/subscribe/:id', checkAuth, UserController.subscribe)
router.post('/getSubscribersTo', checkAuth, UserController.getSubscribersTo)
router.post('/getSubscribers', checkAuth, UserController.getSubscribers)

router.delete('/dellAllUsers', UserController.dellAllAcc)

export default router