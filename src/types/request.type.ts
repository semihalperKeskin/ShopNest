import { Request } from "express";

export type JwtPayload = {
  sub: string;
  iat?: number;
  exp?: number;
};

export type AuthenticatedRequest = Request & {
  user?: JwtPayload;
};
