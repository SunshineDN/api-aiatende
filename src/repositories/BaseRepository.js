export default class BaseRepository {

  /**
   * Repositório base para todas as classes de repositório.
   * @template {keyof import('@prisma/client').PrismaClient} T
   * @param {import('@prisma/client').PrismaClient[T]} model - O modelo PrismaClient a ser usado.
   */
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    // return await this.model.create(data);
    return await this.model.create({
      data,
    });
  }

  async bulkCreate(data) {
    // return await this.model.bulkCreate(data);
    return await this.model.createMany({
      data,
    });
  }

  async findAll(query = {}) {
    // return await this.model.findAll(query);
    return await this.model.findMany(query);
  }

  async findOne(query = {}) {
    // return await this.model.findOne(query);
    return await this.model.findFirst(query);
  }

  async findById(id) {
    // return await this.model.findByPk(id);
    return await this.model.findUnique({
      where: {
        id,
      },
    });
  }

  async findOrCreate(query = {}) {
    // const [create, created] = await this.model.findOrCreate(query);
    // return [create, created];
    const create = await this.model.upsert(query);
    return create;
  }

  async update(id, data) {
    // return await this.model.update(data, { where: { id } });
    return await this.model.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(query) {
    // return await this.model.destroy(query);
    return await this.model.delete(query);
  }
};