import { Length, IsEmail } from 'class-validator';

export class User {
    id: string;

    @Length(10, 80)
    name: string;

    @Length(10, 100)
    @IsEmail()
    email: string;

    @Length(6, 20)
    password: string;

    comparePassword?: (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;
}

export const userSchema = {
    id: { type: 'string', required: true, example: '111111' },
    name: { type: 'string', required: true, example: 'Javier' },
    password: { type: 'string', required: true, example: '123.com' },
    email: { type: 'string', required: true, example: 'avileslopez.javier@gmail.com' }
};