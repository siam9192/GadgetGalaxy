// src/@types/express.d.ts

import express from "express";
import { TRole } from "../modules/user/user.interface";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        role: TRole;
      };
      // Add other properties here as needed
    }
  }
}
