import { Table, Model, Column, DataType, HasOne, HasMany, ForeignKey, BelongsToMany } from "sequelize-typescript";
import VerifyUser from "./verifyUser";
import Like from "./like";
import Tags from "./tags";
import TagsUser from "./tagsUser";
import Subscriptions from "./subscriptions";
import { BelongsToManyGetAssociationsMixin } from "sequelize";
import Views from "./views";
import Comments from "./comments";

@Table({tableName: "user"})
export default class User extends Model<User>{
    @Column({type:DataType.INTEGER,autoIncrement:true,primaryKey:true})
    id!:number

    @Column({type:DataType.STRING})
    name!:string

    @Column({type:DataType.STRING})
    email!:string

    @Column({type:DataType.STRING})
    password!:string

    @HasOne(() => VerifyUser, 'userId')
    verifyUser!: VerifyUser;

    @HasMany(() => Like, 'userId')
    likes!: Like

    @HasMany(() => Comments)
    comments!: Comments

    @HasMany(() => Views, 'userId')
    views!: Views

    @BelongsToMany(() => Tags, () => TagsUser)
    tags!: Tags[];

    @HasMany(() => Subscriptions, 'userid') // Устанавливаем связь "имеет много"
    subscriptions!: Subscriptions[];


    @BelongsToMany(() => User, {
        through: { model: () => Subscriptions, unique: false },
        as: 'Subscribers',
        foreignKey: 'userid',
        otherKey: 'subscribedId'
    })
    subscribedTo!: User[];

    getSubscriptions!: BelongsToManyGetAssociationsMixin<Subscriptions>;
    getTags!: BelongsToManyGetAssociationsMixin<Tags>;
}