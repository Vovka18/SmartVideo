import { Table, Model, Column, DataType, BelongsToMany, HasMany, ForeignKey } from "sequelize-typescript";
import Tags from "./tags"; // Импортируем модель Tags
import TagsVideo from "./tagsVideo";
import User from "./user";

@Table({ tableName: "tagsUser" })
export default class TagsUser extends Model<TagsUser> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  id!: number;

  @ForeignKey(() => Tags)
  @Column({ type: DataType.INTEGER })
  tagId!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  rating!: number;
}




/*
1)  file test.jsx

const test = () => {
    //logic
}

export const test2 = () => {

}

export default test

import test, {test2} from 'test'

2) filte test.jsx

export const test = () => {

}

import {test} from 'test'

*/