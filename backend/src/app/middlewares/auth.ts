import { UserRole, UserStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../shared/catchAsync";
import AppError from "../Errors/AppError";
import httpStatus from "../shared/http-status";
import config from "../config";
import jwtHelpers from "../shared/jwtHelpers";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../shared/prisma";
import { IAuthUser } from "../modules/Auth/auth.interface";

function auth(
  requiredRoles: UserRole[],
  authConfig?: { providerMode: Boolean },
) {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    // checking if the token is missing
    if (!token) {
      if (authConfig?.providerMode === true) {
        return next();
      }
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // checking if the given token is valid
    let decoded;
    try {
      decoded = jwtHelpers.verifyToken(
        token,
        config.jwt.access_token_secret as string,
      ) as JwtPayload;
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const { role, id, iat } = decoded;

    // checking if the user is exist
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
    }
    // checking if the user is already deleted
    if (user.status === UserStatus.DELETED) {
      throw new AppError(httpStatus.FORBIDDEN, "This user is deleted ! !");
    }

    // checking if the user is blocked

    if (user.status === UserStatus.BLOCKED) {
      throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
    }

    // if (
    //   user.passwordChangedAt &&
    //   User.isJWTIssuedBeforePasswordChanged(
    //     user.passwordChangedAt,
    //     iat as number,
    //   )
    // ) {
    //   throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    // }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized  !");
    }

    req.user = decoded as IAuthUser;
    next();
  });
}

export default auth;
