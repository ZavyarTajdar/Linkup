import { Request, Response, NextFunction } from 'express';

const asyncHandler = (requestHandeler:(req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandeler(req, res, next))
        .catch((error: any) => {
            next(error);
        });
    }
}

export {
    asyncHandler
}