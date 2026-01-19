import { IUser } from "../Interfaces/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
