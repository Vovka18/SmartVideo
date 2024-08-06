import { FileArray } from "express-fileupload";
import Tags from "../models/tags";
import Video from "../models/video";
import Like from "../models/like";
import Views from "../models/views";
import Comments from "../models/comments";

export interface videoDTO {
    title:string | undefined,
    subTitle: string | undefined,
    tags: Array<string> | undefined
    video: FileArray | null | undefined,
    image: FileArray | null | undefined,
}

export interface VideoData extends Video {
    likes: Array<Like>,
    views: Array<Views>,
    comments: Array<Comments>
}

export type TagsRaiting = {tag1:Tags | null, tag2:Tags | null, tag3:Tags | null}
