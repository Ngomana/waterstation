import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("srs", token, { httpOnly: true });
};
