import { Table, Model, Column, DataType, BelongsToMany } from "sequelize-typescript";
import Video from "./video";
import TagsVideo from "./tagsVideo";
import { BelongsToManyAddAssociationMixin, BelongsToManyGetAssociationsMixin } from "sequelize";
import User from "./user";
import TagsUser from "./tagsUser";

@Table({tableName: "tags"})
export default class Tags extends Model<Tags>{
    @Column({type:DataType.INTEGER,autoIncrement:true,primaryKey:true})
    id!:number

    @Column({type:DataType.STRING})
    tag!:string

    @BelongsToMany(() => Video, () => TagsVideo)
    videos!: Video[];


    @BelongsToMany(() => User, () => TagsUser)
    users!: User[];


    // Методы для доступа к связанным данным
    getVideos!: BelongsToManyGetAssociationsMixin<Video>;
    addVideo!: BelongsToManyAddAssociationMixin<Video, number>;
}