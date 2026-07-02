export class AppError extends Error {
    public readonly code: string;
    public readonly timestamp: Date;
    public readonly isOperational: boolean;

    constructor(message: string, code: string = 'UNKNOWN_ERROR', isOperational: boolean = true) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.timestamp = new Date();
        this.isOperational = isOperational;

        // Restore prototype chain
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export const ErrorCodes = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
};
