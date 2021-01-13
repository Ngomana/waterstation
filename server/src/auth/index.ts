import { User } from "../entity/user";
import { sign } from "jsonwebtoken";

export const createRefreshToken = (user: User) => {
  return sign(
    {
      userId: user.id,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};

export const createAccessToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "12h" }
  );
};
