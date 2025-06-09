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
const catchAsync_1 = __importDefault(require("../shared/catchAsync"));
const AppError_1 = __importDefault(require("../Errors/AppError"));
const http_status_1 = __importDefault(require("../shared/http-status"));
const config_1 = __importDefault(require("../config"));
const jwtHelpers_1 = __importDefault(require("../shared/jwtHelpers"));
const prisma_1 = __importDefault(require("../shared/prisma"));
function auth(requiredRoles, authConfig) {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        // checking if the token is missing
        if (!token) {
            if ((authConfig === null || authConfig === void 0 ? void 0 : authConfig.providerMode) === true) {
                return next();
            }
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        // checking if the given token is valid
        let decoded;
        try {
            decoded = jwtHelpers_1.default.verifyToken(token, config_1.default.jwt.access_token_secret);
        }
        catch (error) {
            if (authConfig === null || authConfig === void 0 ? void 0 : authConfig.providerMode)
                return next();
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized");
        }
        const { role, id, iat } = decoded;
        // checking if the user is exist
        const user = yield prisma_1.default.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found !");
        }
        // checking if the user is already deleted
        if (user.status === client_1.UserStatus.DELETED) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is deleted ! !");
        }
        // checking if the user is blocked
        if (user.status === client_1.UserStatus.BLOCKED) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is blocked ! !");
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
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized  !");
        }
        req.user = decoded;
        next();
    }));
}
exports.default = auth;
