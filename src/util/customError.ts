import config from 'config';

const errors = config.get('errors');

export class CustomError {

    private code: string;
    private message: string;
    private details: string;

    constructor(message: string, details?: any) {
        this.code = errors[message] || 'unknown';
        this.message = message;
        this.details = details;
    }

    public toString() {
        return `code=${this.code}, message=${this.message}`;
    }

    public toJSON() {
        return { code: this.code, message: this.message, details: this.details };
    }
}