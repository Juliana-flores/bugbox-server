import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export default class Server {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  basePath: string;

  @Column()
  name: string;

  @Column()
  port: number;
}
