import { Table, Model, Column, DataType, BelongsTo } from "sequelize-typescript";
import User from "./user";

@Table({tableName: "verifyUser"})
export default class VerifyUser extends Model<VerifyUser>{
    @Column({type:DataType.INTEGER,autoIncrement:true,primaryKey:true})
    id!:number

    @BelongsTo(() => User, 'userId')
    user!: User;

    @Column({type:DataType.INTEGER, unique: true})
    userId!:number

    @Column({type:DataType.BOOLEAN})
    isVerify!:boolean

    @Column({type:DataType.STRING})
    verifyToken!:string
}