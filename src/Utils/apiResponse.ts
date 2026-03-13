class ApiResponse {
    status: number;
    data: any;
    message: string;
    success: boolean;

    constructor(
        status: number, 
        data: any = null,
        message?: string, 
    ) {
        this.status = status;
        this.data = data;
        this.message = message || "Success";
        this.success = status >= 200 && status < 300;
    }
}

export { ApiResponse };
