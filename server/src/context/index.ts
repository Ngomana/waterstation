import { Request, Response } from "express";

export interface iContext {
  req: Request;
  res: Response;
  payload?: {
    userId: string;
  };
}
