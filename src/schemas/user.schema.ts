import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';
import * as util from 'util';
import { User } from '../models/user';

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    username: String,
    password: String,
    role: String,

    active: Boolean,

    passwordResetToken: String,
    passwordResetExpires: Date,

    activationToken: String,
    activationExpires: Date,

    profile: {
        fname: String,
        lname: String,
        info: String
    }
}, { timestamps: true });

/**
 * Password hash middleware.
 */
UserSchema.pre('save', (next) => {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword: string) {
    const qCompare = (util as any).promisify(bcrypt.compare);
    return qCompare(candidatePassword, this.password);
};

type UserModel = User & mongoose.Document;
const UserRepository = mongoose.model<UserModel>('User', UserSchema);
export default UserRepository;