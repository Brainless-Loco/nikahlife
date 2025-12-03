import { JwtPayload } from "jsonwebtoken";

export default interface CustomJwtPayload extends JwtPayload {
  userId: string;
  userEmail?: string;
  name?: string;
  gender?: string;
  role?: string;
  hasBiodata?: boolean;
  subscriptionType?: string;
}

