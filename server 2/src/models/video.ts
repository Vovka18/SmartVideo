import { Table, Model, Column, DataType, BelongsToMany, HasMany } from "sequelize-typescript";
import Tags from "./tags";
import TagsVideo from "./tagsVideo";
import { BelongsToManyAddAssociationMixin, BelongsToManyGetAssociationsMixin } from "sequelize";
import Like from "./like";
import Views from "./views";
import Comments from "./comments";

@Table({tableName: "video"})
export default class Video extends Model<Video>{
    @Column({type:DataType.INTEGER,autoIncrement:true,primaryKey:true})
    id!:number

    @Column({type:DataType.INTEGER})
    userid!:number

    @Column({type:DataType.STRING})
    pathVideo!:string

    @Column({type:DataType.STRING})
    pathImage!:string

    @Column({type:DataType.STRING, unique: true})
    title!:string

    @Column({type:DataType.STRING})
    subTitle!:string

    @BelongsToMany(() => Tags, () => TagsVideo)
    tags!: Tags[];

    @HasMany(() => Like)
    likes!: Like[]

    @HasMany(() => Comments)
    comments!: Comments[]

    @HasMany(() => Views)
    views!: Views[]
    
    // Методы для доступа к связанным данным
    getTags!: BelongsToManyGetAssociationsMixin<Tags>;
    addTag!: BelongsToManyAddAssociationMixin<Tags, number>;
}