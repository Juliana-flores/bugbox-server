import type {
  UpdateWriteOpResult,
  EntityTarget,
  Entity,
  FindOneOptions,
  FindManyOptions,
  MongoRepository,
} from 'typeorm';
import type { Cursor } from '../database/cursor';

export class TemplateRepository<T> {
  repository: MongoRepository<any>;

  constructor(cursor: Cursor, entity: EntityTarget<typeof Entity>) {
    this.repository = cursor.getRepository(entity);
  }

  async findOneById(id: number): Promise<T> {
    return this.repository.findOneBy({ id });
  }

  async findOne(options: FindOneOptions<T>): Promise<T> {
    return this.repository.findOne(options);
  }

  async find(options: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async create(entity: Partial<T>): Promise<T> {
    return this.repository.create(entity);
  }

  async save(entity: Partial<T>): Promise<T> {
    return this.repository.save(entity);
  }

  async updateOne(query: object, entity: Partial<T>): Promise<UpdateWriteOpResult> {
    return this.repository.updateOne(query, entity);
  }
}
