import type { DataSource, EntityTarget, Entity, MongoRepository } from 'typeorm';

export class Cursor {
  constructor(private source: DataSource) {
    this.source.setOptions({
      useUnifiedTopology: true,
    });
  }

  async connect(): Promise<void> {
    this.source = await this.source.initialize();
  }

  getRepository(target: EntityTarget<typeof Entity>): MongoRepository<typeof Entity> {
    return this.source.getMongoRepository<typeof Entity>(target);
  }
}
