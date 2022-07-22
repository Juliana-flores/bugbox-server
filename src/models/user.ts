import { Entity, Column, ObjectIdColumn, ObjectID, OneToMany } from 'typeorm';
import { compare } from '../helpers/password';

import Email from './email';

@Entity()
export default class User {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column((type) => Email)
  inbox: Email[];

  @Column((type) => Email)
  outbox: Email[];

  isValidPassword(password: string) {
    return compare(this.password, password);
  }
}
