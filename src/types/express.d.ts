import { IUser } from "../Interfaces/user.interface";
import { Multer } from "multer";

declare global {
    namespace Express {
        interface Request {
            user?: {
                _id: ObjectId;
                // add other user properties here if needed, like email, role, etc.
            };
            files?: {
                [fieldname: string]: Multer.File[];
            } | undefined;
        }
    }
}

export { };
