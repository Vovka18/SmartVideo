import { Table, Model, Column, DataType, ForeignKey } from "sequelize-typescript";
import User from "./user";
import Video from "./video";

@Table({tableName: "comments"})
export default class Comments extends Model<Comments>{
    @Column({type:DataType.INTEGER,autoIncrement:true,primaryKey:true})
    id!:number

    @ForeignKey(() => User)
    @Column({type:DataType.INTEGER})
    userId!:number
    
    @ForeignKey(() => Video)
    @Column({type:DataType.INTEGER})
    idVideo!:number

    @Column({type:DataType.STRING})
    text!:string
}