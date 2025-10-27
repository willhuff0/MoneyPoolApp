import type {
  ClientSession,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  Types,
  UpdateQuery,
} from "mongoose";

export type Id = string | Types.ObjectId;

export class BaseDAO<TDoc, TLean = any> {
  protected model: Model<TDoc>;
  constructor(model: Model<TDoc>) { this.model = model; }

  async create(data: Partial<TDoc>, session?: ClientSession | null): Promise<TLean> {
    const [doc] = await this.model.create([data as any], { session: session || undefined });
    return (doc as any).toObject ? (doc as any).toObject() : (doc as any);
  }

  async findById(id: Id, projection?: ProjectionType<TDoc>, options: QueryOptions = {}): Promise<TLean | null> {
    return this.model.findById(id, projection, options).lean<TLean>().exec();
  }
  async findOne(filter: FilterQuery<TDoc>, projection?: ProjectionType<TDoc>, options: QueryOptions = {}): Promise<TLean | null> {
    return this.model.findOne(filter, projection, options).lean<TLean>().exec();
  }

  async findMany(filter: FilterQuery<TDoc>, projection?: ProjectionType<TDoc>, options: QueryOptions = {}): Promise<TLean[]> {
    return this.model.find(filter, projection, options).lean<TLean[]>().exec();  
  }

  async updateById(id: Id, update: UpdateQuery<TDoc>, options: QueryOptions = {}): Promise<TLean | null> {
    return this.model.findByIdAndUpdate(id, update, { ...options, new: true }).lean<TLean>().exec();
  }
  async updateOne(filter: FilterQuery<TDoc>, update: UpdateQuery<TDoc>, options: QueryOptions = {}): Promise<TLean | null> {
    return this.model.findOneAndUpdate(filter, update, { ...options, new: true }).lean<TLean>().exec();
  }

  async deleteById(id: Id, session?: ClientSession | null): Promise<boolean> {
    const res = await this.model.findByIdAndDelete(id, { session: session || undefined }).exec();
    return !!res;
  }
  async deleteMany(filter: FilterQuery<TDoc>, session?: ClientSession | null): Promise<number> {
    const res = await this.model.deleteMany(filter, { session: session || undefined }).exec();
    return res.deletedCount || 0;
  }
}
