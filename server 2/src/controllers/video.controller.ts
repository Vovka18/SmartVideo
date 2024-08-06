import { NextFunction, Request, Response } from "express"; 
import Video from "../models/video";
import { TagsRaiting, VideoData, videoDTO } from "../types/VideoType";
import { ApiError } from "../error/apiError";
import { IRequest } from "../types/MainType";
import * as uuid from 'uuid'
import * as fs from 'fs'
import * as path from 'path'
import Tags from "../models/tags";
import Like from "../models/like";
import TagsVideo from "../models/tagsVideo";
import ffmpeg from 'fluent-ffmpeg';
import User from "../models/user";
import TagsUser from "../models/tagsUser";
import { connect } from "../database";
import { Op } from "sequelize";
import Views from "../models/views";
import Comments from "../models/comments";
// import sequelize from "sequelize/types/sequelize";

export class VideoController{

    // http://127.0.0.1:4000/api/video/stream/1
    static async get(req:IRequest,resp:Response) {
        const {id} = req.params
        const video = await Video.findOne({where:{id}})
        const stat = fs.statSync( path.resolve('static',video?.pathVideo as string))
        
        const fileSize = stat.size;
        const range = req.headers.range

        console.log(range)

        if (range) {

        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4'
            }
            resp.writeHead(200,head)
            fs.createReadStream(path.resolve('static',video?.pathVideo as string)).pipe(resp);
        }

        // return resp.json({ok:'ok'})
    }

    static async add(req:IRequest, resp:Response, next:NextFunction){
        const {title,subTitle,tags}:videoDTO = req.body
        const video: any = req.files!.video
        const image: any = req.files!.image
        console.log(image);

        if(!subTitle){
            return next(ApiError.notFound('subTitle not found'))
        }
        if(!title){
            return next(ApiError.notFound('title not found'))
        }
        if(!tags || !tags[0]){
            return next(ApiError.notFound('tags not found'))
        }
        if(!video){
            return next(ApiError.notFound('video not found'))
        }
        if(!image){
            return next(ApiError.notFound('image not found'))
        }

        if(!req.user){
            return next(ApiError.notFound('user not found'))
        }

        let videoName:string = uuid.v4();
        videoName += '.' + video.mimetype.split('/')[1]
        
        let imageName:string = uuid.v4();
        imageName += '.' + image.mimetype.split('/')[1]

        const fullpathVideo:string = path.resolve(process.cwd(),'static', req.user.name, title, videoName) 
        const fullpathImage:string = path.resolve(process.cwd(),'static', req.user.name, title, imageName) 
        const pathImage:string =  path.join(req.user.name,title,imageName)
        videoName = uuid.v4();
        videoName += '.' + video.mimetype.split('/')[1]
        const fullpathSmallVideo:string = path.resolve(process.cwd(),'static', req.user.name, title, videoName) 
        const pathSmallVideo:string = path.join(req.user.name,title,videoName)

        console.log(pathImage);
        


        if(fs.existsSync(fullpathVideo)){
            return next(ApiError.badRequest('a video with this title already exists')) 
        }
        
        
        const pathToUser:string = path.resolve(process.cwd(),'static', req.user.name) 
        if(!fs.existsSync(pathToUser)){
            fs.mkdirSync(pathToUser,{recursive:true})
        }
        
        video.mv(fullpathVideo)
        image.mv(fullpathImage)

        fs.mkdirSync(path.resolve('static', req.user.name, title), {recursive:true})
        
        new Promise<void>((resolve,reject)=>{
            ffmpeg(fullpathVideo)
            .outputOptions('-crf 28')
            .on('error', (err: any) => reject(err))
            .on('end', () => {
                fs.unlinkSync(fullpathVideo)
                resolve();
            })
            .save(fullpathSmallVideo);
        });


        try{
            const videoNew:Video | null = await Video.create({
                userid: req.user.id,
                pathVideo: pathSmallVideo,
                pathImage: pathImage,
                title: title,
                subTitle: subTitle
            } as Video)
            tags.forEach(async (findTag:string) => {
                console.log('foreach')
                let tag: Tags | null = await Tags.findOne({where: {tag:findTag}})
                if(!tag){
                    tag = await Tags.create({tag:findTag} as Tags)   
                }
                const tagsVideo:TagsVideo | null = await TagsVideo.create({videoId: videoNew.id, tagId:tag.id } as TagsVideo)
            });
            const respJson = {
                userid: req.user.id,
                pathVideo: pathSmallVideo,
                pathImage: pathImage,
                title: title,
                subTitle: subTitle, 
                tags
            }
            return resp.status(201).json(respJson)
        }catch  (e){
            console.log(e)
            return next(ApiError.internal('')) 
        }
    }

    static async getVideoUser(req:IRequest, resp:Response, next:NextFunction){
        if(!req.user){
            return next(ApiError.badRequest()) 
        }

        const allVideos: Array<Video> = await Video.findAll({where:{userid: req.user.id}})
        return resp.status(200).json(allVideos)
    }

    static async like(req:IRequest, resp:Response, next:NextFunction){
            if(!req.user){
                return next(ApiError.badRequest()) 
            }
            if(!req.params){
                return next(ApiError.badRequest()) 
            }
            if(!req.params.id){
                return next(ApiError.badRequest()) 
            }

            /*
                idVideo
                idUser

                1) Достать like object который содержит idVideo и idUser 
                    Если такой объект у нас есть - удаляем его
                    Если такого объекта нет:
                        1) пытаемся найти видео по idVideo
                        Если такого видео нет - отправляем 404
                        Если такое видео есть
                            1)Создаем объект в лайк с текущим ид видео и ид юзер

            */
            const id:string = req.params.id

            const video:Video | null = await Video.findOne({where:{id:id}})
            if(!video){
                return next(ApiError.notFound('not found')) 
            } 
            if(!req.user){
                return next(ApiError.notFound('not found')) 
            }

            let like:Like | null = await Like.findOne({where:{idVideo:id}})
            if(like){
                like?.destroy()

                const tagsVideo: Array<Tags> = await video.getTags()
                const tagsUser: Array<Tags> = await req.user.getTags()

                tagsVideo.forEach( async (tag:Tags) => {
                    const findTag = tagsUser.find((uTag)=>uTag.id === tag.id)
                    if(!findTag){
                        TagsUser.create({tagId:tag.id, userId: req.user?.id} as TagsUser)
                    }else{
                        if (req.user) {
                            const userTag:TagsUser = await TagsUser.findOne({where:{tagId:findTag.id, userId: req.user.id}}) as TagsUser
                            userTag.rating = userTag.rating-1
                            await userTag.save()
                        }
                    }
                })
                
                return resp.status(201).json({message: 'like deleted'})
            }

            like = await Like.create({userId: req.user.id, idVideo:video.id} as Like)
            //{tagName: 5}
            /*
                1 - получить массив тегов с видео
                2 - проверять каждый тег нет ли его еще у пользователя
                3 - если нет создавать запись в тагсюзер и добавлять туда его
            
            */
            const tagsVideo: Array<Tags> = await video.getTags()
            const tagsUser: Array<Tags> = await req.user.getTags()

            tagsVideo.forEach( async (tag:Tags) => {
                const findTag = tagsUser.find((uTag)=>uTag.id === tag.id)
                if(!findTag){
                    TagsUser.create({tagId:tag.id, userId: req.user?.id} as TagsUser)
                }else{
                    if (req.user) {
                        const userTag:TagsUser = await TagsUser.findOne({where:{tagId:findTag.id, userId: req.user.id}}) as TagsUser
                        userTag.rating = userTag.rating+1
                        await userTag.save()
                    }
                }
            })
            
            return resp.status(200).json({message:'like add'})
        }
        
        static async getLikes(req:IRequest, resp:Response, next:NextFunction){
            if(!req.user){
                return next(ApiError.notFound('not found')) 
            }

            const likes:Array<Like> = await Like.findAll({where:{userId:req.user.id}})
            if(likes.length == 0){
                return next(ApiError.notFound('not found')) 
            }

            return resp.status(200).json(likes)

        }

        static async getRecom(req:IRequest, resp:Response, next: NextFunction) {
            if(!req.user){
                return next(ApiError.notFound('user not found'))
            }

            //const tags:Array<Tags> = await req.user.getTags()
            const tags:Array<TagsUser> = await TagsUser.findAll({where:{userId:req.user.id}})
            console.log(tags, req.user.id);
            

            if(tags.length == 0){
                // 15 видео 
                // 1 - отобрать 50 самых популярных и оттуда вытянуть 15 рандомных

                try {
                    const videos = await Video.findAll({
                        include: [
                            {
                                association: "likes",
                                attributes: [],
                            },
                        ],
                        attributes: {
                            include: [
                                [connect.literal("(SELECT COUNT(*) FROM `likes` WHERE `likes`.`IdVideo` = `Video`.`id`)"), "likeCount"],
                            ],
                        },
                        order: [[connect.literal("likeCount"), "DESC"]],
                        limit: 50,
                    });
            
                    for (let i = videos.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [videos[i], videos[j]] = [videos[j], videos[i]];
                    }
                } catch (error) {
                    return next(ApiError.notFound('not found')) 
                }
            }

            const recomendation:VideoData[] = []

            tags.sort((tag1, tag2) => tag1.rating - tag2.rating)

            const indexs:number[] = []
            while (indexs.length < 2 && indexs.length < tags.length-1) {
                const randomIndex = Math.floor(Math.random() * tags.length);
                if (indexs.includes(randomIndex) == false) {
                    indexs.push(randomIndex);
                }
            }

            const popularTags:Array<TagsUser> = [tags[0], tags[indexs[0]], tags[indexs[1]]]

            console.log(popularTags)
            for (const popularTag of popularTags) {
                if (!popularTag) {
                    console.log(popularTag)
                    break
                }
                const tag = await Tags.findOne({where: {id: popularTag.tagId}})
                const videos:Array<Video> = await tag?.getVideos() as Video[]
                if(videos){
                    console.log(videos);
                    for(let video of videos){
                        // получить статистику этого видео, после чего статистику добавить в объект video и после этого добавить видео в рекомендации
                        const videoData:VideoData = await Video.findOne({where: {id: video.id}, include: [Like, Views, Comments]}) as VideoData
                        const chekRepeatVideo:VideoData | undefined = recomendation.find((recomendVideo:VideoData)=> recomendVideo.id == video.id)
                        if(!chekRepeatVideo){
                            recomendation.push(videoData)
                        }
                    }
                }
            }
            
            return resp.status(200).json(recomendation)
        }
        static async delVideo(req:IRequest, resp:Response, next:NextFunction){
            if(!req.user){
                return next(ApiError.badRequest('user not found'))
            }
            if(!req.params){
                return next(ApiError.badRequest('id not found'))
            }
            if(!req.params.id){
                return next(ApiError.badRequest('id not found'))
            }

            const video = await Video.findOne({where: {userid: req.user.id}})
            
            if(!video){
                return next(ApiError.notFound('video not found'))
            } 
            
            console.log(video.pathVideo);

            return resp.status(200).json('ok')
        }

        static async getLikesVideo(req:IRequest, resp:Response, next:NextFunction){
            if(!req.user){
                return next(ApiError.badRequest('user not found'))
            }
            const likes:Array<Like> = await Like.findAll({where:{userId:req.user.id}})
            const videos:Array<Video> = []
            for(const like of likes){
                const video:Video | null = await Video.findOne({where:{id:like.idVideo}})
                if(video){
                    videos.push(video)
                }
            }
            return resp.status(200).json(videos)
        }

        static async getNewVideos(req:IRequest, resp:Response, next:NextFunction){
            if(!req.user){
                return next(ApiError.badRequest('user not found'))
            }
            const videos:Array<VideoData> = await Video.findAll({
                order: [['createdAt', 'DESC']],
                limit: 10,
                include: [Like, Views, Comments]
            })

            return resp.status(200).json(videos)
        }

        static async searchVideo(req:IRequest, resp:Response, next:NextFunction){
            if(!req.user){
                return next(ApiError.badRequest('user not found'))
            }
            if(!req.body.word){
                return next(ApiError.badRequest('symbols not found'))
            }
            const vieods:Array<Video> = await Video.findAll({where: {
                title: {
                    [Op.like]: `${req.body.word}%`
                }
            }})
            return resp.status(200).json(vieods)
        }

        static async views(req:IRequest, resp:Response, next:NextFunction){
            if(!req.user){
                return next(ApiError.badRequest('user not found'))
            }
            if(!req.params.id){
                return next(ApiError.badRequest('id not found'))
            }
            if(!Number(req.params.id)){
                return next(ApiError.badRequest('id not found'))
            }

            let view:Views | null = await Views.findOne({where: {idVideo: req.params.id, userId: req.user.id}})
            console.log({userId: req.user.id, idVideo: Number(req.params.id)})
            if(!view){
                view = await Views.create({userId: req.user.id, idVideo: Number(req.params.id)} as Views)
                return resp.status(200).json(view)
            }
            return resp.status(201)
        }

        static async addComment(req:IRequest, resp:Response, next:NextFunction){
            if(!req.user){
                return next(ApiError.badRequest('user not found'))
            }
            if(!req.body.text){
                return next(ApiError.badRequest('text comment not found'))
            }
            if(!req.params.id){
                return next(ApiError.badRequest('video id not found'))
            }
            if(typeof req.body.text != "string"){
                return next(ApiError.badRequest('typeof text comment incorrect'))
            }
            if(!Number(req.params.id)){
                return next(ApiError.badRequest('typeof video id incorrect'))
            }

            console.log(Number(req.params.id));
            
            const chekVideo:Video | null = await Video.findOne({where: {id: Number(req.params.id)}})

            if(!chekVideo){
                return next(ApiError.badRequest('video by id not found'))
            }
            
            try{
                if(!req.user){
                    return next(ApiError.badRequest('user not found'))
                }
                const comment:Comments | null = await Comments.create({userId: Number(req.user.id), idVideo: Number(req.params.id), text: String(req.body.text)} as Comments)
                return resp.status(200).json(comment)
            }catch (e:any){
                console.log(e.message);
                return next(ApiError.internal('Error'))
            }
        }

        static async dellComments(req:IRequest, resp:Response, next:NextFunction){
            if(!req.user){
                return next(ApiError.badRequest('user not found'))
            }
            if(!req.params.idComment){
                return next(ApiError.badRequest('comment id not found'))
            }
            if(!Number(req.params.idComment)){
                return next(ApiError.badRequest('typeof comment id incorrect'))
            }

            const comment:Comments | null = await Comments.findOne({where: {id: req.params.idComment}})
            if(!comment){
                return next(ApiError.badRequest('comment is not found'))
            }
            const video:Video | null = await Video.findOne({where: {id: comment.idVideo}})
            if(!video){
                return next(ApiError.internal('Error'))
            }
            if(req.user.id == video.userid){
                comment.destroy()
                return resp.status(200).json({message:'ok'})
            }
            if(comment.userId != req.user.id){
                return next(ApiError.forbidden('No access'))
            }
            comment.destroy()
            return resp.status(200).json({message:'ok'})
        }

        static async dataVideo(req:IRequest, resp:Response, next:NextFunction){
            //количествой лайков
            //комментарии и колличество комментариев
            //количество просмотры
            if(!req.user){
                return next(ApiError.badRequest('user not found'))
            }
            if(!req.params.id){
                return next(ApiError.badRequest('id incorrect')) 
            }
            if(!Number(req.params.id)){
                return next(ApiError.badRequest('typeof video id incorrect'))
            }
            const video:Video | null = await Video.findOne({where: {id: req.params.id}, include: [Like, Views, Comments]})
            if(!video){
                return next(ApiError.badRequest('video by id not found'))
            }

            const countLikes:number = video.likes.length
            const countViews:number = video.views.length
            const countComments:number = video.comments.length
            const comments:Array<Comments> = video.comments

            // const countLikes:number = await Like.count({where: {idVideo: req.params.id}});
            // const countViews:number = await Views.count({where: {idVideo: req.params.id}});
            // const countComments:number = await Comments.count({where: {idVideo: req.params.id}});
            // const comments:Array<Comments> = await Comments.findAll({where: {idVideo: req.params.id}})

            console.log(video.likes);
            
            return resp.status(200).json({countLikes, countViews, countComments, comments})
        }
        static async getVideoId(req:IRequest, resp:Response, next:NextFunction){
            if(!req.user){
                return next(ApiError.badRequest('user not found'))
            }
            if(!req.params.id){
                return next(ApiError.badRequest('id incorrect')) 
            }
            if(!Number(req.params.id)){
                return next(ApiError.badRequest('typeof video id incorrect'))
            }
            const videoData:VideoData | null = await Video.findOne({where: {id: req.params.id}, include: [Like, Views, Comments]}) as VideoData
            if(!videoData){
                return next(ApiError.badRequest('video not found'))
            }
            return resp.status(200).json(videoData)
        }


}
