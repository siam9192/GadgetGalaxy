"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const http_status_1 = __importDefault(require("../../shared/http-status"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const bycrypt_1 = require("../../utils/bycrypt");
const ejs_1 = __importDefault(require("ejs"));
const jwtHelpers_1 = __importDefault(require("../../shared/jwtHelpers"));
const config_1 = __importDefault(require("../../config"));
const function_1 = require("../../utils/function");
const path_1 = __importDefault(require("path"));
const node_mailer_service_1 = __importDefault(require("../NodeMailer/node-mailer.service"));
const axios_1 = __importDefault(require("axios"));
const register = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (account) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Account is already exist using this email");
    }
    //  Generate otp
    const otp = (0, function_1.generateOtp)();
    const today = new Date();
    const expireAt = new Date(Date.now() + 5 * 60 * 1000);
    const hashedPassword = yield (0, bycrypt_1.bcryptHash)(payload.password);
    const hashedOtp = yield (0, bycrypt_1.bcryptHash)(otp);
    const verificationData = {
        fullName: payload.fullName,
        email: payload.email,
        password: hashedPassword,
        otp: hashedOtp,
        otpLastGeneratedAt: today,
        expireAt,
    };
    // Create registration request into db
    const created = yield prisma_1.default.registrationRequest.create({
        data: verificationData,
    });
    if (!created) {
        throw new AppError_1.default(500, "Something went wrong!.Please try again");
    }
    // Send email with OTP verification code
    const emailSendStatus = yield ejs_1.default.renderFile(path_1.default.join(process.cwd(), "/src/app/templates/account-verification-email.ejs"), { name: payload.fullName, otp }, function (err, template) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err) {
                throw new AppError_1.default(400, "Something went wrong");
            }
            else {
                const status = yield node_mailer_service_1.default.sendEmail({
                    emailAddress: payload.email,
                    subject: "Verify your GadgetGalaxy account",
                    template,
                });
            }
        });
    });
    console.log(otp);
    const tokenPayload = {
        email: payload.email,
        requestId: created.id,
    };
    // Generate a secret token with 1hr expire time
    const token = jwtHelpers_1.default.generateToken(tokenPayload, config_1.default.jwt.account_verification_secret, "1hr");
    return {
        email: payload.email,
        token,
    };
});
const verifyRegistrationUsingOTP = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = (yield jwtHelpers_1.default.verifyToken(data.token, config_1.default.jwt.account_verification_secret));
    const verification = yield prisma_1.default.registrationRequest.findUnique({
        where: {
            id: decodedToken.requestId,
            isVerified: false,
        },
    });
    if (!verification) {
        throw new AppError_1.default(500, "OTP is expired! Or Used");
    }
    const account = yield prisma_1.default.user.findUnique({
        where: {
            email: decodedToken.email,
        },
    });
    if (account) {
        throw new AppError_1.default(500, "Something went wrong");
    }
    // Match otp
    const isOtpMatched = yield (0, bycrypt_1.bcryptCompare)(data.otp, verification.otp);
    // Throw error on not match otp
    if (!isOtpMatched) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Wrong OTP!.Please enter correct OTP");
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Create user after successfully verified
        const createdUser = yield tx.user.create({
            data: {
                role: client_1.UserRole.CUSTOMER,
                email: verification.email,
                password: verification.password,
                authProvider: client_1.AuthProvider.EMAIL_PASSWORD,
            },
        });
        yield tx.customer.create({
            data: {
                userId: createdUser.id,
                fullName: verification.fullName,
            },
        });
        // Update registration request
        yield tx.registrationRequest.update({
            where: {
                id: decodedToken.requestId,
            },
            data: {
                isVerified: true,
                userId: createdUser.id,
            },
        });
        return null;
    }));
    return result;
});
const resendOtp = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // Check token existence
    if (!token) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Token is required");
    }
    const decodedToken = (yield jwtHelpers_1.default.verifyToken(token, config_1.default.jwt.account_verification_secret));
    const verificationData = yield prisma_1.default.registrationRequest.findUnique({
        where: {
            id: decodedToken.requestId,
            isVerified: false,
        },
    });
    if (!verificationData) {
        throw new AppError_1.default(500, "OTP is expired! Or Used");
    }
    const account = yield prisma_1.default.user.findUnique({
        where: {
            email: decodedToken.email,
        },
    });
    if (account) {
        throw new AppError_1.default(500, "Something went wrong");
    }
    // Generate new otp
    const newOtp = (0, function_1.generateOtp)();
    //hash otp
    const hashedOtp = yield (0, bycrypt_1.bcryptHash)(newOtp);
    const expireAt = new Date(Date.now() + 5 * 60 * 1000);
    yield prisma_1.default.registrationRequest.update({
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
    const emailSendStatus = yield ejs_1.default.renderFile(path_1.default.join(process.cwd(), "/src/app/templates/account-verification-email.ejs"), { name: verificationData.fullName, otp: newOtp }, function (err, template) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err) {
                throw new AppError_1.default(400, "Something went wrong");
            }
            else {
                const status = yield node_mailer_service_1.default.sendEmail({
                    emailAddress: decodedToken.email,
                    subject: "Verify your GadgetGalaxy account",
                    template,
                });
            }
        });
    });
    const tokenPayload = {
        email: verificationData.email,
        verificationId: verificationData.id,
    };
    const newToken = jwtHelpers_1.default.generateToken(tokenPayload, config_1.default.jwt.account_verification_secret, "1hr");
    return {
        email: decodedToken.email,
        token: newToken,
    };
});
const googleCallback = (_a) => __awaiter(void 0, [_a], void 0, function* ({ accessToken: googleAccessToken, }) {
    const { data } = yield axios_1.default.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
            Authorization: `Bearer ${googleAccessToken}`,
        },
    });
    let tokenPayload = {
        authProvider: client_1.AuthProvider.GOOGLE,
    };
    const user = yield prisma_1.default.user.findFirst({
        where: {
            googleId: data.id,
            authProvider: client_1.AuthProvider.GOOGLE,
        },
    });
    if (user) {
        if (user.status === client_1.UserStatus.DELETED)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Use not found");
        if (user.status === client_1.UserStatus.BLOCKED)
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Account is Blocked");
        const updateData = {
            fullName: data.name,
            profilePhotoUrl: data.picture,
        };
        yield prisma_1.default.customer.update({
            where: {
                userId: user.id,
            },
            data: updateData,
        });
        tokenPayload.id = user.id;
        tokenPayload.role = user.role;
    }
    else {
        const isEmailUserExist = yield prisma_1.default.user.findUnique({
            where: {
                email: data.email,
            },
        });
        if (isEmailUserExist)
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "This email already in use");
        yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const createdUser = yield tx.user.create({
                data: {
                    email: data.email,
                    authProvider: client_1.AuthProvider.GOOGLE,
                    googleId: data.id,
                    role: client_1.UserRole.CUSTOMER,
                },
            });
            yield tx.customer.create({
                data: {
                    userId: createdUser.id,
                    fullName: data.name,
                    profilePhoto: data.picture,
                },
            });
            tokenPayload.id = createdUser.id;
            tokenPayload.role = createdUser.role;
        }));
    }
    // Generating access token
    const accessToken = jwtHelpers_1.default.generateToken(tokenPayload, config_1.default.jwt.access_token_secret, "7d");
    // Generating refresh token
    const refreshToken = jwtHelpers_1.default.generateToken(tokenPayload, config_1.default.jwt.access_token_secret, config_1.default.jwt.refresh_token_secret);
    return {
        accessToken,
        refreshToken,
    };
});
const facebookCallback = () => __awaiter(void 0, void 0, void 0, function* () { });
const login = (res, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: {
            email: data.email,
            authProvider: client_1.AuthProvider.EMAIL_PASSWORD,
            status: {
                not: client_1.UserStatus.DELETED,
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
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Account not found");
    }
    const { password } = user;
    // Comparing password
    const isMatched = yield (0, bycrypt_1.bcryptCompare)(data.password, password);
    // Checking is password correct
    if (!isMatched) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Wrong email or password");
    }
    // Throw error base on account status
    switch (user.status) {
        case client_1.UserStatus.BLOCKED:
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Account is blocked.Please contact with our support team");
        case client_1.UserStatus.SUSPENDED:
            throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Account is suspended.Please contact with our support team");
        default:
            break;
    }
    const tokenPayload = {
        id: user.id,
        role: user.role,
    };
    // Insert profile id base on user role
    if (user.role === client_1.UserRole.CUSTOMER) {
        tokenPayload.customerId = user.customer.id;
    }
    else {
        tokenPayload.administratorId = user.administrator.id;
    }
    // Generating access token
    const accessToken = jwtHelpers_1.default.generateToken(tokenPayload, config_1.default.jwt.access_token_secret, config_1.default.jwt.access_token_expire_time);
    // Generating refresh token
    const refreshToken = jwtHelpers_1.default.generateToken(tokenPayload, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expire_time);
    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken);
    return {
        accessToken,
        refreshToken,
    };
});
const logout = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    // await prisma.userActivity.update({
    //   where: {
    //     id: authUser.activityId,
    //   },
    //   data: {
    //     logoutAt: new Date(),
    //   },
    // });
    // return null;
});
const getAccessTokenUsingRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    try {
        if (!refreshToken) {
            throw new Error();
        }
        // Decode refreshToken
        const decode = jwtHelpers_1.default.verifyToken(refreshToken, config_1.default.jwt.refresh_token_secret);
        if (!decode)
            throw new Error();
        const tokenPayload = {
            id: decode.id,
            role: decode.role,
        };
        // Insert profile id base on user role
        if (decode.role === client_1.UserRole.CUSTOMER) {
            tokenPayload.customerId = decode.customerId;
        }
        else {
            tokenPayload.administratorId = decode.administratorId;
        }
        // Generating access token
        const accessToken = jwtHelpers_1.default.generateToken(tokenPayload, config_1.default.jwt.access_token_secret, config_1.default.jwt.access_token_expire_time);
        return {
            accessToken,
        };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "BAD😒 request!");
    }
});
const changePassword = (authUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
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
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const isMatched = yield (0, bycrypt_1.bcryptCompare)(payload.oldPassword, payload.newPassword);
    // Match password
    if (isMatched) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Wrong  password");
    }
    const hashedNewPassword = yield (0, bycrypt_1.bcryptHash)(payload.newPassword);
    // Update new password
    yield prisma_1.default.user.update({
        where: {
            id: authUser.id,
        },
        data: {
            password: hashedNewPassword,
        },
    });
    return null;
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: {
            email,
        },
    });
    // Check user existence
    if (!user)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No user found");
    // Set expire time
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 6);
    const session = yield prisma_1.default.passwordResetRequest.create({
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
    const token = jwtHelpers_1.default.generateToken(tokenPayload, config_1.default.jwt.reset_password_token_secret, config_1.default.jwt.reset_password_token_expire_time);
    const resetLink = `${config_1.default.origin}/reset-password/${token}`;
    // Send password reset link to email
    yield ejs_1.default.renderFile(path_1.default.join(process.cwd(), "/src/app/templates/reset-password-email.ejs"), { link: resetLink }, function (err, template) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err) {
                throw new AppError_1.default(400, "Something went wrong");
            }
            else {
                yield node_mailer_service_1.default.sendEmail({
                    emailAddress: email,
                    subject: "Password reset link",
                    template,
                });
            }
        });
    });
    return null;
});
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify token
    let decode;
    try {
        decode = (yield jwtHelpers_1.default.verifyToken(payload.token, config_1.default.jwt.reset_password_token_secret));
        if (!decode)
            throw new Error();
        const session = yield prisma_1.default.passwordResetRequest.findUnique({
            where: {
                id: decode.sessionId,
                expiresAt: {
                    gt: new Date(),
                },
                isUsed: false,
            },
        });
        if (!session)
            throw new Error();
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Sorry maybe reset link expired,used or something wrong");
    }
    // Hash new password using bcrypt
    const hashedNewPassword = yield (0, bycrypt_1.bcryptHash)(payload.newPassword);
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.user.update({
            where: {
                id: decode.userId,
            },
            data: {
                password: hashedNewPassword,
                passwordLastChangedAt: new Date(),
            },
        });
        yield tx.passwordResetRequest.update({
            where: {
                id: decode.sessionId,
            },
            data: {
                isUsed: true,
            },
        });
    }));
    return null;
});
const getMeFromDB = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (yield prisma_1.default.user.findUnique({
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
    }));
    let data;
    if (user.role === client_1.UserRole.CUSTOMER) {
        const customer = user.customer;
        data = {
            email: user.email,
            authProvider: user.authProvider,
            fullName: customer === null || customer === void 0 ? void 0 : customer.fullName,
            profilePhoto: customer.profilePhoto,
            phoneNumber: customer.phoneNumber,
            dateOfBirth: customer.dateOfBirth,
            gender: customer.gender,
            addresses: customer.addresses,
            role: user.role,
            status: user.status,
            passwordLastChangedAt: user.passwordLastChangedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    else {
        const administrator = user.administrator;
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
});
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
exports.default = AuthServices;
