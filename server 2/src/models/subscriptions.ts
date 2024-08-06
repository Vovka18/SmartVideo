import { Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import User from "./user"; // Подключаем модель User
import { BelongsToManyGetAssociationsMixin } from "sequelize";

@Table({ tableName: "subscriptions" })
export default class Subscriptions extends Model<Subscriptions> {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id!: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userid!: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    subscribedId!: number;

    @BelongsTo(() => User, 'userid')
    user!: User;

    @BelongsTo(() => User, 'subscribedId')
    subscribedUser!: User;
}