import { AccountStatus, AuthProvider, UserRole } from "@prisma/client";
import AppError from "../../Errors/AppError";
import httpStatus from "../../shared/http-status";
import prisma from "../../shared/prisma";
import { bcryptCompare, bcryptHash } from "../../utils/bycrypt";
import ejs from "ejs";
import {
  IAuthUser,
  IChangePasswordPayload,
  ILoginData,
  IOtpPayload,
  IRegisterPayload,
  IVerifyAccountData,
} from "./auth.interface";
import jwtHelpers from "../../shared/jwtHelpers";
import config from "../../config";
import { Response } from "express";
import { generateOtp } from "../../utils/function";
import path from "path";
import NodeMailerServices from "../NodeMailer/node-mailer.service";
import { JwtPayload } from "jsonwebtoken";

const register = async (payload: IRegisterPayload) => {
  const account = await prisma.account.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (account) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Account is already exist using this email",
    );
  }

  //  Generate otp
  const otp = generateOtp();
  const today = new Date();

  const expireAt = new Date(Date.now() + 5 * 60 * 1000);
  const hashedPassword = await bcryptHash(payload.password);
  const hashedOtp = await bcryptHash(otp);

  const verificationData = {
    fullName: payload.fullName,
    email: payload.email,
    password: hashedPassword,
    otp: hashedOtp,
    otpLastGeneratedAt: today,
    expireAt,
  };

  console.log("OTP is ", otp);

  const created = await prisma.newAccountVerification.create({
    data: verificationData,
  });

  if (!created) {
    throw new AppError(500, "Something went wrong!.Please try again");
  }

  const emailSendStatus = await ejs.renderFile(
    path.join(
      process.cwd(),
      "/src/app/templates/account-verification-email.ejs",
    ),
    { name: payload.fullName, otp },
    async function (err, template) {
      if (err) {
        throw new AppError(400, "Something went wrong");
      } else {
        const status = await NodeMailerServices.sendEmail({
          emailAddress: payload.email,
          subject: "Verify your GadgetGalaxy account",
          template,
        });
      }
    },
  );

  const tokenPayload = {
    email: payload.email,
    verificationId: created.id,
  };

  const token = jwtHelpers.generateToken(
    tokenPayload,
    config.jwt_account_verification_secret as string,
    "1hr",
  );

  return {
    email: payload.email,
    token,
  };
};

const verifyRegisterUsingOTP = async (data: IVerifyAccountData) => {
  const decodedToken = (await jwtHelpers.verifyToken(
    data.token,
    config.jwt_account_verification_secret as string,
  )) as JwtPayload & IOtpPayload;

  const verification = await prisma.newAccountVerification.findUnique({
    where: {
      id: decodedToken.verificationId,
      otpLastGeneratedAt: {
        lte: new Date(),
      },
    },
  });

  if (!verification) {
    throw new AppError(500, "Something went wrong");
  }

  const account = await prisma.account.findUnique({
    where: {
      email: decodedToken.email,
    },
  });

  if (account) {
    throw new AppError(500, "Something went wrong");
  }

  const isOtpMatched = await bcryptCompare(data.otp, verification.otp);

  if (!isOtpMatched) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Wrong OTP!.Please enter correct OTP",
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    // Create user
    const createdUser = await tx.user.create({
      data: {
        role: UserRole.Customer,
      },
    });

    // Create user account auth details
    const createdAccount = await tx.account.create({
      data: {
        userId: createdUser.id,
        email: verification.email,
        password: verification.password,
        authProvider: AuthProvider.EmailPassword,
      },
    });

    // Create customer profile
    const createdCustomer = await tx.customer.create({
      data: {
        userId: createdUser.id,
        fullName: verification.fullName,
      },
    });

    await tx.newAccountVerification.update({
      where: {
        id: decodedToken.verificationId,
      },
      data: {
        isVerified: true,
      },
    });

    return await tx.user.findUnique({
      where: {
        id: createdUser.id,
      },
      include: {
        customer: true,
      },
    });
  });

  return result;
};

const resendOtp = async (token: string) => {
  // Check token existence
  if (!token) {
    throw new AppError(httpStatus.NOT_FOUND, "Token is required");
  }

  const decodedToken = (await jwtHelpers.verifyToken(
    token,
    config.jwt_account_verification_secret as string,
  )) as JwtPayload & IOtpPayload;

  const verificationData = await prisma.newAccountVerification.findUnique({
    where: {
      id: decodedToken.verificationId,
      expireAt: {
        gte: new Date(),
      },
    },
  });

  if (!verificationData) {
    throw new AppError(500, "OTP is expired!");
  }

  const account = await prisma.account.findUnique({
    where: {
      email: decodedToken.email,
    },
  });

  if (account) {
    throw new AppError(500, "Something went wrong");
  }

  // Generate new otp
  const newOtp = generateOtp();

  //hash otp
  const hashedOtp = await bcryptHash(newOtp);
  const expireAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.newAccountVerification.update({
    where: {
      id: decodedToken.verificationId,
    },
    data: {
      otp: hashedOtp,
      otpLastGeneratedAt: new Date(),
      otpGenerateCount: {
        increment: 1,
      },
      expireAt,
    },
  });

  const emailSendStatus = await ejs.renderFile(
    path.join(
      process.cwd(),
      "/src/app/templates/account-verification-email.ejs",
    ),
    { name: verificationData.fullName, otp: newOtp },
    async function (err, template) {
      if (err) {
        throw new AppError(400, "Something went wrong");
      } else {
        const status = await NodeMailerServices.sendEmail({
          emailAddress: decodedToken.email,
          subject: "Verify your GadgetGalaxy account",
          template,
        });
      }
    },
  );

  const tokenPayload = {
    email: verificationData.email,
    verificationId: verificationData.id,
  };

  const newToken = jwtHelpers.generateToken(
    tokenPayload,
    config.jwt_account_verification_secret as string,
    "5m",
  );

  return {
    email: decodedToken.email,
    token: newToken,
  };
};

const login = async (data: ILoginData) => {
  const user = await prisma.user.findFirst({
    where: {
      account: {
        email: data.email,
        authProvider: AuthProvider.EmailPassword,
      },
      status: {
        not: AccountStatus.Deleted,
      },
    },
    include: {
      account: true,
      customer: {
        select: {
          id: true,
        },
      },
      staff: {
        select: {
          id: true,
        },
      },
    },
  });

  // Checking user existence
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Account not found");
  }

  const { password } = user.account!;

  // Throw error base on account status
  switch (user.status) {
    case AccountStatus.Blocked:
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        "This account is blocked.Please contact with out support team",
      );
    case AccountStatus.Suspended:
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        "This account is suspended.Please contact with out support team",
      );
    default:
      break;
  }

  // Comparing password
  const isMatched = await bcryptCompare(data.password, password!);

  // Checking is password correct
  if (!isMatched) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Wrong email or password");
  }

  const tokenPayload: IAuthUser = {
    id: user.id,
    role: user.role,
  };

  // Insert profile id base on user role
  if (user.role === UserRole.Customer) {
    tokenPayload.customerId = user.customer!.id;
  } else {
    tokenPayload.staffId = user.staff!.id;
  }

  // Generating access token
  const accessToken = jwtHelpers.generateToken(
    tokenPayload,
    config.jwt_access_secret as string,
    "30d",
  );
  // Generating refresh token
  const refreshToken = jwtHelpers.generateToken(
    tokenPayload,
    config.jwt_refresh_token_secret as string,
    config.jwt_refresh_token_expire_time as string,
  );
  return {
    accessToken,
    refreshToken,
  };
};

const getAccessToken = async (res: Response) => {
  // const refreshToken = res.cookie[]
};

const changePassword = async (
  authUser: IAuthUser,
  payload: IChangePasswordPayload,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: authUser.id,
    },
    select: {
      account: {
        select: {
          authProvider: true,
          password: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isMatched = await bcryptCompare(
    payload.oldPassword,
    payload.newPassword,
  );

  if (isMatched) {
    throw new AppError(httpStatus.NOT_FOUND, "Wrong  password");
  }

  const hashedNewPassword = await bcryptHash(payload.newPassword);

  await prisma.account.update({
    where: {
      userId: authUser.id,
    },
    data: {
      password: hashedNewPassword,
    },
  });

  return null;
};

const AuthServices = {
  register,
  verifyRegisterUsingOTP,
  resendOtp,
  login,
  changePassword,
};

export default AuthServices;
