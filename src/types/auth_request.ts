import { Request } from "express";
import { IUser } from "../Interfaces/user.interface";

export interface AuthRequest extends Request {
    user: IUser;
}
