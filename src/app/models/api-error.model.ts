export class ApiError {
    status: number;
    message: string;

    constructor(message: string, status: number = 400) {
        this.status = status;
        this.message = message;
    }
}
