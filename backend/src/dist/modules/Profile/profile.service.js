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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../shared/prisma"));
const client_1 = require("@prisma/client");
const profile_validation_1 = __importDefault(require("./profile.validation"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const http_status_1 = __importDefault(require("../../shared/http-status"));
const updateMyProfileIntoDB = (authUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check user existence
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: authUser.id,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    let result;
    if (user.role === client_1.UserRole.CUSTOMER) {
        const data = payload;
        profile_validation_1.default.UpdateCustomerProfileValidation.parse(data);
        result = yield prisma_1.default.$transaction((txClient) => __awaiter(void 0, void 0, void 0, function* () {
            const { addresses } = data, othersData = __rest(data, ["addresses"]);
            if (othersData.dateOfBirth) {
                othersData.dateOfBirth = new Date(othersData.dateOfBirth);
            }
            yield txClient.customer.update({
                where: {
                    id: authUser.customerId,
                },
                data: othersData,
            });
            // Update addresses
            if (addresses && addresses.length) {
                const deletedAddresses = addresses === null || addresses === void 0 ? void 0 : addresses.filter((_) => _.id && _.isDeleted);
                const newAddedAddresses = addresses === null || addresses === void 0 ? void 0 : addresses.filter((_) => !_.id && !_.isDeleted);
                const updatedAddresses = addresses.filter((_) => _.id && !_.isDeleted);
                if (deletedAddresses.length) {
                    yield txClient.customerAddress.deleteMany({
                        where: {
                            id: {
                                in: deletedAddresses.map((_) => _.id),
                            },
                        },
                    });
                }
                if (newAddedAddresses.length) {
                    yield txClient.customerAddress.createMany({
                        data: newAddedAddresses.map((address) => ({
                            customerId: authUser.customerId,
                            district: address.district,
                            zone: address.zone,
                            line: address.line,
                            isDefault: address.isDefault || false,
                        })),
                    });
                }
                if (updatedAddresses.length) {
                    yield Promise.all(updatedAddresses.map((address) => txClient.customerAddress.updateMany({
                        where: {
                            id: address.id,
                        },
                        data: {
                            district: address.district,
                            zone: address.zone,
                            line: address.line,
                            isDefault: address.isDefault || false,
                        },
                    })));
                }
            }
            return yield txClient.customer.findUnique({
                where: {
                    id: authUser.customerId,
                },
                include: {
                    addresses: true,
                },
            });
        }));
    }
    // Update administrator
    else {
        const data = payload;
        profile_validation_1.default.UpdateAdministratorProfileValidation.parse(data);
        result = yield prisma_1.default.administrator.update({
            where: {
                id: authUser.administratorId,
            },
            data,
        });
    }
    return result;
});
const ProfileServices = {
    updateMyProfileIntoDB,
};
exports.default = ProfileServices;
