import { Collection, Document, Filter, OptionalUnlessRequiredId, UpdateFilter, FindOptions, DeleteResult, UpdateResult, WithId } from 'mongodb';
import { MongodbService } from './mongodb.service';

/**
 * Abstract base repository for MongoDB operations
 * Extend this class to create domain-specific repositories
 * 
 * @example
 * ```typescript
 * @Injectable()
 * export class UserRepository extends BaseMongoRepository<User> {
 *   constructor(mongodbService: MongodbService) {
 *     super(mongodbService, 'users');
 *   }
 * }
 * ```
 */
export abstract class BaseMongoRepository<T extends Document> {
    protected collection: Collection<T>;

    constructor(
        protected readonly mongodbService: MongodbService,
        protected readonly collectionName: string,
    ) {
        this.collection = this.mongodbService.getDb().collection<T>(collectionName);
    }

    /**
     * Find a single document matching the filter
     */
    async findOne(filter: Filter<T>, options?: FindOptions): Promise<WithId<T> | null> {
        return this.collection.findOne(filter, options);
    }

    /**
     * Find multiple documents matching the filter
     */
    async findMany(filter: Filter<T>, options?: FindOptions): Promise<WithId<T>[]> {
        return this.collection.find(filter, options).toArray();
    }

    /**
     * Find a document by its ID
     */
    async findById(id: string): Promise<WithId<T> | null> {
        return this.collection.findOne({ _id: id } as Filter<T>);
    }

    /**
     * Create a new document
     */
    async create(document: OptionalUnlessRequiredId<T>): Promise<WithId<T>> {
        const result = await this.collection.insertOne(document);
        return { ...document, _id: result.insertedId } as WithId<T>;
    }

    /**
     * Create multiple documents
     */
    async createMany(documents: OptionalUnlessRequiredId<T>[]): Promise<WithId<T>[]> {
        const result = await this.collection.insertMany(documents);
        return documents.map((doc, index) => ({
            ...doc,
            _id: result.insertedIds[index],
        })) as WithId<T>[];
    }

    /**
     * Update a single document matching the filter
     */
    async updateOne(
        filter: Filter<T>,
        update: UpdateFilter<T>,
    ): Promise<UpdateResult> {
        return this.collection.updateOne(filter, update);
    }

    /**
     * Update multiple documents matching the filter
     */
    async updateMany(
        filter: Filter<T>,
        update: UpdateFilter<T>,
    ): Promise<UpdateResult> {
        return this.collection.updateMany(filter, update);
    }

    /**
     * Update a document by its ID
     */
    async updateById(
        id: string,
        update: UpdateFilter<T>,
    ): Promise<UpdateResult> {
        return this.collection.updateOne({ _id: id } as Filter<T>, update);
    }

    /**
     * Delete a single document matching the filter
     */
    async deleteOne(filter: Filter<T>): Promise<DeleteResult> {
        return this.collection.deleteOne(filter);
    }

    /**
     * Delete multiple documents matching the filter
     */
    async deleteMany(filter: Filter<T>): Promise<DeleteResult> {
        return this.collection.deleteMany(filter);
    }

    /**
     * Delete a document by its ID
     */
    async deleteById(id: string): Promise<DeleteResult> {
        return this.collection.deleteOne({ _id: id } as Filter<T>);
    }

    /**
     * Count documents matching the filter
     */
    async count(filter: Filter<T>): Promise<number> {
        return this.collection.countDocuments(filter);
    }

    /**
     * Check if a document exists matching the filter
     */
    async exists(filter: Filter<T>): Promise<boolean> {
        const count = await this.collection.countDocuments(filter, { limit: 1 });
        return count > 0;
    }
}
