export interface Like {
    id: number,
    userId: number,
    idVideo: number,
}
export interface Comments {
    id: number,
    userId: number,
    idVideo: number,
    text: string,
}
export interface Views{
    id:number,
    userId: number,
    idVideo: number,
}

export interface Video {
    id:number,
    userId:number,
    pathVideo:string,
    pathImage:string,
    title:string,
    subTitle:string,
    createdAt:string,
    updatedAt:string,
    TagsVideo: {
        id:number,
        videoId:number,
        tagId:number,
        createdAt:string,
        updatedAt:string,
    }
    likes: Array<Like>,
    views: Array<Views>,
    comments: Array<Comments>,
}

export interface IRecomendType {
    videos: Array<Video>
    state: {isLoading: boolean, error: string}
}

export interface IVideo {
    video: Video
    state: {isLoading: boolean, error: string}
}


export interface IGetVideo {token:string, idVideo: number}