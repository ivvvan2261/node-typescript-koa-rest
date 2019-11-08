import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import util from 'util';
import { User } from '../models/user';

type UserDocument = mongoose.Document & User;

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
    const user = this as UserDocument;
    if (!user.isModified('password')) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword: string) {
    const qCompare = (util as any).promisify(bcrypt.compare);
    return qCompare(candidatePassword, this.password);
};

const UserRepository = mongoose.model<UserDocument>('User', userSchema);
export default UserRepository;