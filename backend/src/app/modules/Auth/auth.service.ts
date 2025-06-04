import { AuthProvider, UserRole, UserStatus } from "@prisma/client";
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
  IResetPasswordPayload,
  IVerifyAccountData,
} from "./auth.interface";
import jwtHelpers from "../../shared/jwtHelpers";
import config from "../../config";
import { Request, Response } from "express";
import { generateOtp } from "../../utils/function";
import path from "path";
import NodeMailerServices from "../NodeMailer/node-mailer.service";
import { JwtPayload } from "jsonwebtoken";
import axios from "axios";

const register = async (payload: IRegisterPayload) => {
  const account = await prisma.user.findUnique({
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

  // Create registration request into db
  const created = await prisma.registrationRequest.create({
    data: verificationData,
  });

  if (!created) {
    throw new AppError(500, "Something went wrong!.Please try again");
  }

  // Send email with OTP verification code
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
  console.log(otp);
  const tokenPayload = {
    email: payload.email,
    requestId: created.id,
  };

  // Generate a secret token with 1hr expire time
  const token = jwtHelpers.generateToken(
    tokenPayload,
    config.jwt.account_verification_secret as string,
    "1hr",
  );

  return {
    email: payload.email,
    token,
  };
};

const verifyRegistrationUsingOTP = async (data: IVerifyAccountData) => {
  const decodedToken = (await jwtHelpers.verifyToken(
    data.token,
    config.jwt.account_verification_secret as string,
  )) as JwtPayload & IOtpPayload;

  const verification = await prisma.registrationRequest.findUnique({
    where: {
      id: decodedToken.requestId,
      isVerified: false,
    },
  });

  if (!verification) {
    throw new AppError(500, "OTP is expired! Or Used");
  }

  const account = await prisma.user.findUnique({
    where: {
      email: decodedToken.email,
    },
  });

  if (account) {
    throw new AppError(500, "Something went wrong");
  }

  // Match otp
  const isOtpMatched = await bcryptCompare(data.otp, verification.otp);

  // Throw error on not match otp
  if (!isOtpMatched) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      "Wrong OTP!.Please enter correct OTP",
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    // Create user after successfully verified
    const createdUser = await tx.user.create({
      data: {
        role: UserRole.CUSTOMER,
        email: verification.email,
        password: verification.password,
        authProvider: AuthProvider.EMAIL_PASSWORD,
      },
    });
    await tx.customer.create({
      data: {
        userId: createdUser.id,
        fullName: verification.fullName,
      },
    });
    // Update registration request
    await tx.registrationRequest.update({
      where: {
        id: decodedToken.requestId,
      },
      data: {
        isVerified: true,
        userId: createdUser.id,
      },
    });
    return null;
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
    config.jwt.account_verification_secret as string,
  )) as JwtPayload & IOtpPayload;

  const verificationData = await prisma.registrationRequest.findUnique({
    where: {
      id: decodedToken.requestId,
      isVerified: false,
    },
  });
  if (!verificationData) {
    throw new AppError(500, "OTP is expired! Or Used");
  }

  const account = await prisma.user.findUnique({
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

  await prisma.registrationRequest.update({
    where: {
      id: decodedToken.requestId,
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
    config.jwt.account_verification_secret as string,
    "1hr",
  );

  return {
    email: decodedToken.email,
    token: newToken,
  };
};

const googleCallback = async ({
  accessToken: googleAccessToken,
}: {
  accessToken: string;
}) => {
  const { data } = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${googleAccessToken}`,
      },
    },
  );
  let tokenPayload: any = {
    authProvider: AuthProvider.GOOGLE,
  };

  const user = await prisma.user.findFirst({
    where: {
      googleId: data.id,
      authProvider: AuthProvider.GOOGLE,
    },
  });

  if (user) {
    if (user.status === UserStatus.DELETED)
      throw new AppError(httpStatus.NOT_FOUND, "Use not found");
    if (user.status === UserStatus.BLOCKED)
      throw new AppError(httpStatus.NOT_ACCEPTABLE, "Account is Blocked");
    const updateData = {
      fullName: data.name,
      profilePhotoUrl: data.picture,
    };

    await prisma.customer.update({
      where: {
        userId: user.id,
      },
      data: updateData,
    });
    tokenPayload.id = user.id;
    tokenPayload.role = user.role;
  } else {
    const isEmailUserExist = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (isEmailUserExist)
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        "This email already in use",
      );

    await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: data.email,
          authProvider: AuthProvider.GOOGLE,
          googleId: data.id,
          role: UserRole.CUSTOMER,
        },
      });
      await tx.customer.create({
        data: {
          userId: createdUser.id,
          fullName: data.name,
          profilePhoto: data.picture,
        },
      });

      tokenPayload.id = createdUser.id;
      tokenPayload.role = createdUser.role;
    });
  }

  // Generating access token
  const accessToken = jwtHelpers.generateToken(
    tokenPayload,
    config.jwt.access_token_secret as string,
    "7d",
  );
  // Generating refresh token
  const refreshToken = jwtHelpers.generateToken(
    tokenPayload,
    config.jwt.access_token_secret as string,
    config.jwt.refresh_token_secret as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const login = async (res: Response, data: ILoginData) => {
  const user = await prisma.user.findFirst({
    where: {
      email: data.email,
      authProvider: AuthProvider.EMAIL_PASSWORD,
      status: {
        not: UserStatus.DELETED,
      },
    },
    include: {
      customer: {
        select: {
          id: true,
        },
      },
      administrator: {
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

  const { password } = user;

  // Comparing password
  const isMatched = await bcryptCompare(data.password, password!);

  // Checking is password correct
  if (!isMatched) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Wrong email or password");
  }

  // Throw error base on account status
  switch (user.status) {
    case UserStatus.BLOCKED:
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        "Account is blocked.Please contact with our support team",
      );
    case UserStatus.SUSPENDED:
      throw new AppError(
        httpStatus.NOT_ACCEPTABLE,
        "Account is suspended.Please contact with our support team",
      );
    default:
      break;
  }

  const tokenPayload: IAuthUser = {
    id: user.id,
    role: user.role,
  };

  // Insert profile id base on user role
  if (user.role === UserRole.CUSTOMER) {
    tokenPayload.customerId = user.customer!.id;
  } else {
    tokenPayload.administratorId = user.administrator!.id;
  }

  // Generating access token
  const accessToken = jwtHelpers.generateToken(
    tokenPayload,
    config.jwt.access_token_secret as string,
    config.jwt.access_token_expire_time as string,
  );
  // Generating refresh token
  const refreshToken = jwtHelpers.generateToken(
    tokenPayload,
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expire_time as string,
  );

  // Set refresh token in cookie
  res.cookie("refreshToken", refreshToken);

  return {
    accessToken,
    refreshToken,
  };
};

const logout = async (authUser: IAuthUser) => {
  // await prisma.userActivity.update({
  //   where: {
  //     id: authUser.activityId,
  //   },
  //   data: {
  //     logoutAt: new Date(),
  //   },
  // });
  // return null;
};

const getAccessTokenUsingRefreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    if (!refreshToken) {
      throw new Error();
    }

    // Decode refreshToken
    const decode = jwtHelpers.verifyToken(
      refreshToken,
      config.jwt.refresh_token_secret as string,
    ) as JwtPayload & IAuthUser;

    if (!decode) throw new Error();
    const tokenPayload: IAuthUser = {
      id: decode.id,
      role: decode.role,
    };
  
    // Insert profile id base on user role
    if (decode.role === UserRole.CUSTOMER) {
      tokenPayload.customerId = decode.customerId;
    } else {
      tokenPayload.administratorId =decode.administratorId;
    }
  

    // Generating access token
  const accessToken = jwtHelpers.generateToken(
    tokenPayload,
    config.jwt.access_token_secret as string,
    config.jwt.access_token_expire_time as string,
  );
    return {
     accessToken,
    };
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "BAD😒 request!");
  }
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
      authProvider: true,
      password: true,
    },
  });

  // Check user existence
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isMatched = await bcryptCompare(
    payload.oldPassword,
    payload.newPassword,
  );

  // Match password
  if (isMatched) {
    throw new AppError(httpStatus.NOT_FOUND, "Wrong  password");
  }

  const hashedNewPassword = await bcryptHash(payload.newPassword);

  // Update new password
  await prisma.user.update({
    where: {
      id: authUser.id,
    },
    data: {
      password: hashedNewPassword,
    },
  });

  return null;
};

const forgetPassword = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  // Check user existence
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "No user found");

  // Set expire time
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 6);

  const session = await prisma.passwordResetRequest.create({
    data: {
      userId: user.id,
      expiresAt,
    },
  });

  const tokenPayload = {
    sessionId: session.id,
    userId: user.id,
    email,
  };

  // Generate secret token
  const token = jwtHelpers.generateToken(
    tokenPayload,
    config.jwt.reset_password_token_secret as string,
    config.jwt.reset_password_token_expire_time as string,
  );

  const resetLink = `${config.origin}/reset-password/${token}`;

  // Send password reset link to email
  await ejs.renderFile(
    path.join(process.cwd(), "/src/app/templates/reset-password-email.ejs"),
    { link: resetLink },
    async function (err, template) {
      if (err) {
        throw new AppError(400, "Something went wrong");
      } else {
        await NodeMailerServices.sendEmail({
          emailAddress: email,
          subject: "Password reset link",
          template,
        });
      }
    },
  );

  return null;
};

const resetPassword = async (payload: IResetPasswordPayload) => {
  // Verify token
  let decode;
  try {
    decode = (await jwtHelpers.verifyToken(
      payload.token,
      config.jwt.reset_password_token_secret as string,
    )) as JwtPayload & {
      sessionId: string;
      userId: number;
      email: string;
    };

    if (!decode) throw new Error();

    const session = await prisma.passwordResetRequest.findUnique({
      where: {
        id: decode.sessionId,
        expiresAt: {
          gt: new Date(),
        },
        isUsed: false,
      },
    });

    if (!session) throw new Error();
  } catch (error) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Sorry maybe reset link expired,used or something wrong",
    );
  }

  // Hash new password using bcrypt
  const hashedNewPassword = await bcryptHash(payload.newPassword);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: decode.userId,
      },
      data: {
        password: hashedNewPassword,
        passwordLastChangedAt: new Date(),
      },
    });
    await tx.passwordResetRequest.update({
      where: {
        id: decode.sessionId,
      },
      data: {
        isUsed: true,
      },
    });
  });

  return null;
};

const getMeFromDB = async (authUser: IAuthUser) => {
  const user = (await prisma.user.findUnique({
    where: {
      id: authUser.id,
    },
    include: {
      customer: {
        include: {
          addresses: true,
        },
      },
      administrator: true,
    },
  }))!;

  let data;
  if (user.role === UserRole.CUSTOMER) {
    const customer = user.customer!;
    data = {
      email: user.email,
      authProvider: user.authProvider,
      fullName: customer?.fullName,
      profilePhoto: customer.profilePhoto,
      phoneNumber: customer.phoneNumber,
      dateOfBirth:customer.dateOfBirth,
      gender: customer.gender,
      addresses: customer.addresses,
      role:user.role,
      status: user.status,
      passwordLastChangedAt:user.passwordLastChangedAt,
      createdAt:user.createdAt,
      updatedAt:user.updatedAt,
    };
  } else {
    const administrator = user.administrator!;
    data = {
      email: user.email,
      authProvider: user.authProvider,
      fullName: administrator.fullName,
      profilePhoto: administrator.profilePhoto,
      phoneNumber: administrator.phoneNumber,
      gender: administrator.gender,
      status: user.status,
    };
  }

  return data;
};

const AuthServices = {
  register,
  verifyRegistrationUsingOTP,
  resendOtp,
  googleCallback,
  login,
  logout,
  changePassword,
  forgetPassword,
  resetPassword,
  getAccessTokenUsingRefreshToken,
  getMeFromDB,
};

export default AuthServices;
