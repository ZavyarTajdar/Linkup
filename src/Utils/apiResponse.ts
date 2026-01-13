class apiResponse {
    status: number;
    message: string;
    data: any;
    success: boolean;

    constructor(
        status: number, 
        data: any, 
        message?: string
    ) {
        this.status = status;
        this.data = data;
        this.message = message || "Success";
        this.success = status >= 200 && status < 300;
    }
}

export { apiResponse };
