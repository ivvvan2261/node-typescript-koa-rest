import { Length, IsEmail, IsNotEmpty } from 'class-validator';

export class User {
    id: string;

    @Length(1, 80)
    @IsNotEmpty()
    name: string;

    @Length(6, 20)
    @IsNotEmpty()
    password: string;

    @IsEmail()
    email: string;

    comparePassword?: (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;
}

export const userSchema = {
    name: { type: 'string', required: true, example: 'admin' },
    password: { type: 'string', required: true, example: '123.com' },
    email: { type: 'string', example: 'bngj.admin@gmail.com' }
};