import { AuthUser } from "../../app/module/user/user.interface";

declare global {
  namespace Express {

    interface User extends AuthUser {}


    interface Request {
      user?: AuthUser;
    }
  }
}
