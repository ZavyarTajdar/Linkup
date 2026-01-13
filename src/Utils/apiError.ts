class ApiError extends Error {
    status: number;
    data?: any;
    errors?: any[];
    success: boolean;

    constructor(
        status: number,
        message: string,
        data: any = null,
        errors: any[] = [],
        stack?: string
    ) {
        super(message);
        this.name = this.constructor.name; // Helps to identify the error type
        this.status = status;
        this.data = data;
        this.errors = errors;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
