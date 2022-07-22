import { uuid } from 'uuidv4';
import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

interface EmailParams {
  removed?: boolean;
  subject: string;
  body: string;
  from: string;
  to: string;
  sid?: string;
}
export default class Email {
  @Column()
  sid: string;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  subject: string;

  @Column()
  body: string;

  @Column()
  removed: boolean;

  constructor(
    sid: string = '',
    from: string,
    to: string,
    subject: string,
    body: string,
    removed: boolean
  ) {
    this.subject = subject;
    this.removed = removed;
    this.body = body;
    this.from = from;
    this.to = to;
    this.sid = sid || uuid();
  }
}
