import { Model, Document } from 'mongoose';

/**
 * @class BaseService
 */
export abstract class BaseService<T> {

    abstract Repository: Model<T & Document>;

    /**
     * @description Fetches all docs from the storage
     * @returns {Promise<T[]>}
     */
    async findAll(): Promise<T[]> {
        return await this.Repository.find() as T[];
    }

    /**
     * @description Fetches single doc from the storage by id
     * @param {string} id
     * @returns {Promise<T>}
     */
    async findById(id: string): Promise<T> {
        const doc: T = await this.Repository.findById(id);
        return doc;
    }

    /**
     * @description Saves the doc in the storage
     * @param {T} doc
     * @returns {Promise<T>}
     */
    async save(doc: T): Promise<T> {
        return (await new this.Repository(doc).save()).toObject({ virtuals: true });
    }

    /**
     * @description Fetches single doc by activationToken and sets active flag
     * @param activationToken
     * @returns {Promise<T>}
     */
    async findOneAndUpdate(activationToken): Promise<T> {
        const doc: T = await this.Repository.findOneAndUpdate({ activationToken: activationToken }, { active: true }, { new: true });
        return doc;
    }

    /**
     * @description Deletes a single doc from storage
     * @returns {Promise<object>}
     */
    async deleteOne(id: string): Promise<object> {
        return await this.Repository.deleteOne({ _id: id });
    }
}