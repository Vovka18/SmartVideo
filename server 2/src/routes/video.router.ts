import { Router } from "express"
import { VideoController } from "../controllers/video.controller"
import checkAuth from "../middleware/chekAuth"

const router = Router()

router.get('/stream/:id',checkAuth,VideoController.get)
router.post('/add', checkAuth, VideoController.add)
router.get('/getVideoUser', checkAuth, VideoController.getVideoUser)
router.get('/getLikesVideo', checkAuth, VideoController.getLikesVideo)
router.get('/getNewVideos', checkAuth, VideoController.getNewVideos)
router.get('/recomendation', checkAuth, VideoController.getRecom)
router.get('/searchVideo', checkAuth, VideoController.searchVideo)
router.get('/dataVideo/:id', checkAuth, VideoController.dataVideo)
router.get('/getVideoid/:id', checkAuth, VideoController.getVideoId)
router.post('/like/:id', checkAuth, VideoController.like)
router.post('/likes', checkAuth, VideoController.getLikes)
router.post('/comment/:id', checkAuth, VideoController.addComment)
router.post('/view/:id', checkAuth, VideoController.views)
router.delete('/delVideo/:id', checkAuth, VideoController.delVideo)
router.delete('/delComment/:idComment', checkAuth, VideoController.dellComments)
export default router