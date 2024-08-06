import { Table, Model, Column, DataType, ForeignKey } from "sequelize-typescript";
import Video from "./video";
import Tags from "./tags";

@Table({tableName: "tagsVideo"})
export default class TagsVideo extends Model<TagsVideo>{
    @Column({type:DataType.INTEGER,autoIncrement:true,primaryKey:true})
    id!:number

    @ForeignKey(() => Video)
    @Column({ type: DataType.INTEGER })
    videoId!: number;

    @ForeignKey(() => Tags)
    @Column({ type: DataType.INTEGER })
    tagId!: number;
}