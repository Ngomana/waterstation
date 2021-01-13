import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { iContext } from "../context";

export const isAuth: MiddlewareFn<iContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new Error("not authorized by tony");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (error) {
    console.log(error);
    throw error;
  }

  return next();
};
