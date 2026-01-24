import { IUser } from "../Interfaces/user.interface";
import { Multer } from "multer";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            files?: {
                [fieldname: string]: Multer.File[];
            };
        }
    }
}

export {};
