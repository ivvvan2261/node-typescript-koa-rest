import { User } from '../models/user';
import * as bcrypt from 'bcrypt-nodejs';
import * as util from 'util';
import UserRepository from '../schemas/user.schema';

/**
 * @class UserService
 */
class UserService {

    /**
     * @description Fetches single user from the storage by id
     * @param {string} id
     * @returns {Promise<User>}
     */
    async findById(id: string): Promise<User> {
        const user: User = await UserRepository.findOne({ id: id });
        return user;
    }

    /**
     * @description Fetches single user from the storage by email or name
     * @param {string} name
     * @param {string} email
     * @returns {Promise<User>}
     */
    async findByNameOrEmail(name: string, email: string): Promise<User> {
        const user: User = await UserRepository.findOne({ $or: [{ email: email }, { name: name }] });
        return user;
    }

    /**
     * @description Saves the user in the storage
     * @param {User} user
     * @returns {Promise<User>}
     */
    async save(user: User): Promise<User> {
        return (await new UserRepository(user).save()).toObject({ virtuals: true });
    }

    /**
     * @description Fetches single user by activationToken and sets active flag
     * @param activationToken
     * @returns {Promise<User>}
     */
    async findOneAndUpdate(activationToken): Promise<User> {
        const user: User = await UserRepository.findOneAndUpdate({ activationToken: activationToken }, { active: true }, { new: true });
        return user;
    }

    /**
     * @description Fetches all users from the storage
     * @returns {Promise<User[]>}
     */
    async findAll(): Promise<User[]> {
        return await UserRepository.find() as User[];
    }

    /**
     * @description Deletes a single user from storage
     * @returns {Promise<object>}
     */
    async deleteOne(id: string): Promise<object> {
        return await UserRepository.deleteOne({ id: id });
    }

    /**
     * @description Compares encrypted and decrypted passwords
     * @param {string} candidatePassword
     * @param storedPassword
     * @returns {boolean}
     */
    comparePassword(candidatePassword: string, storedPassword): boolean {
        const qCompare = (util as any).promisify(bcrypt.compare);
        return qCompare(candidatePassword, storedPassword);
    }
}

export default new UserService();