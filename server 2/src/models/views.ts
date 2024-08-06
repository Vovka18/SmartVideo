import { Table, Model, Column, DataType, ForeignKey } from "sequelize-typescript";
import Video from "./video";
import User from "./user";

@Table({tableName: "views"})
export default class Views extends Model<Views>{
    @Column({type:DataType.INTEGER,autoIncrement:true,primaryKey:true})
    id!:number

    @ForeignKey(() => User)
    @Column({type:DataType.INTEGER})
    userId!:number
    
    @ForeignKey(() => Video)
    @Column({type:DataType.INTEGER})
    idVideo!:number
}