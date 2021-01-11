import { Request, Response } from 'express';
import { ApiError } from 'app';

export function globalErrorHandler(err: any, _req: Request, res: Response, _next: () => void) {
    if (err instanceof ApiError) {
        res.status(err.status).send({ message: err.message });
    } else {
        res.status(500).send({ message: err.message });
    }

    console.error('*** Exception: ' + err.message);
    console.error(err);
}
