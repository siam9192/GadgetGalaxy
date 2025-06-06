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
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const response_1 = require("../../shared/response");
const http_status_1 = __importDefault(require("../../shared/http-status"));
const user_service_1 = __importDefault(require("./user.service"));
const pick_1 = __importDefault(require("../../utils/pick"));
const constant_1 = require("../../utils/constant");
const changeUserStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.default.ChangeUserStatusIntoDB(req.user, req.body);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "User status changed successfully",
        data: result,
    });
}));
const getCustomers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, ["searchTerm", "status"]);
    const options = (0, pick_1.default)(req.query, constant_1.paginationOptionKeys);
    const result = yield user_service_1.default.getCustomersFromDB(filters, options);
    (0, response_1.sendSuccessResponse)(res, Object.assign({ statusCode: http_status_1.default.OK, message: "Customers retrieved successfully" }, result));
}));
const getAdministrators = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, ["searchTerm", "status", "role"]);
    const options = (0, pick_1.default)(req.query, constant_1.paginationOptionKeys);
    const result = yield user_service_1.default.getAdministratorsFromDB(filters, options);
    (0, response_1.sendSuccessResponse)(res, Object.assign({ statusCode: http_status_1.default.OK, message: "Administrators retrieved successfully" }, result));
}));
const softDeleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.default.softDeleteUserByIdIntoDB(req.user, req.params.userId);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "User deleted successfully",
        data: result,
    });
}));
const createAdministrator = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.default.createAdministratorIntoDB(req.user, req.body);
    (0, response_1.sendSuccessResponse)(res, {
        statusCode: http_status_1.default.OK,
        message: "Administrator created successfully",
        data: result,
    });
}));
const UserControllers = {
    changeUserStatus,
    getCustomers,
    getAdministrators,
    softDeleteUser,
    createAdministrator,
};
exports.default = UserControllers;
