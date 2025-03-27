"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const http_status_1 = __importDefault(require("../../shared/http-status"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const paginationHelper_1 = require("../../helpers/paginationHelper");
const bycrypt_1 = require("../../utils/bycrypt");
const ChangeUserStatusIntoDB = (authUser, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
      where: {
        id: payload.userId,
        status: {
          not: client_1.UserStatus.DELETED,
        },
      },
    });
    // Checking user existence
    if (!user) {
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        "User not found",
      );
    }
    yield prisma_1.default.$transaction((txClient) =>
      __awaiter(void 0, void 0, void 0, function* () {
        yield txClient.user.update({
          where: {
            id: payload.userId,
          },
          data: {
            status: payload.status,
          },
        });
        yield txClient.administratorActivityLog.create({
          data: {
            administratorId: authUser.administratorId,
            action: `User status updated from ${user.status} to ${payload.status} (User ID: ${payload.userId}).`,
          },
        });
      }),
    );
  });
const getCustomersFromDB = (filterQuery, paginationOptions) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, status } = filterQuery;
    const { limit, skip, page, sortOrder, orderBy } = (0,
    paginationHelper_1.calculatePagination)(paginationOptions);
    const andConditions = [];
    // If search term exist then search data by search term
    if (searchTerm && !Number.isNaN(searchTerm)) {
      andConditions.push({
        id: Number(searchTerm),
      });
    } else {
      if (searchTerm) {
        andConditions.push({
          OR: [
            {
              fullName: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              user: {
                email: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            },
          ],
        });
      }
    }
    const whereConditions = {
      AND: andConditions,
      user: {
        role: client_1.UserRole.CUSTOMER,
        status: {
          not: client_1.UserStatus.DELETED,
        },
      },
    };
    const customers = yield prisma_1.default.customer.findMany({
      where: whereConditions,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            authProvider: true,
            status: true,
            lastLoginAt: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            orders: {
              where: {
                status: client_1.OrderStatus.DELIVERED,
              },
            },
            productReviews: true,
          },
        },
      },
      take: limit,
      skip: skip,
      orderBy: {
        [orderBy]: sortOrder,
      },
    });
    const totalResult = yield prisma_1.default.customer.count({
      where: whereConditions,
    });
    const total = yield prisma_1.default.customer.count({
      where: {
        user: {
          status: client_1.UserStatus.DELETED,
        },
      },
    });
    const data = customers.map((customer) => {
      const { user } = customer;
      return {
        id: customer.id,
        fullName: customer.fullName,
        email: user.email,
        profilePhoto: customer.profilePhoto,
        phoneNumber: customer.phoneNumber,
        gender: customer.gender,
        authProvider: user.authProvider,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updated: customer.updatedAt,
        count: customer._count,
      };
    });
    const meta = {
      page,
      limit,
      skip,
      totalResult,
      total,
    };
    return {
      data,
      meta,
    };
  });
const getAdministratorsFromDB = (filterQuery, paginationOptions) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, status, role } = filterQuery;
    const { limit, skip, page, sortOrder, orderBy } = (0,
    paginationHelper_1.calculatePagination)(paginationOptions);
    const andConditions = [];
    // If search term exist then search data by search term
    if (searchTerm && !Number.isNaN(searchTerm)) {
      andConditions.push({
        id: Number(searchTerm),
      });
    } else {
      if (searchTerm) {
        andConditions.push({
          OR: [
            {
              fullName: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              user: {
                email: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            },
          ],
        });
      }
    }
    if (role) {
      andConditions.push({
        user: {
          role,
        },
      });
    }
    if (status) {
      andConditions.push({
        user: {
          role,
        },
      });
    }
    const whereConditions = {
      AND: andConditions,
      user: {
        role: client_1.UserRole.CUSTOMER,
        status: {
          not: client_1.UserStatus.DELETED,
        },
      },
    };
    const administrators = yield prisma_1.default.administrator.findMany({
      where: whereConditions,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            authProvider: true,
            status: true,
            lastLoginAt: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      take: limit,
      skip: skip,
      orderBy: {
        [orderBy]: sortOrder,
      },
    });
    const totalResult = yield prisma_1.default.administrator.count({
      where: whereConditions,
    });
    const total = yield prisma_1.default.administrator.count({
      where: {
        user: {
          status: client_1.UserStatus.DELETED,
        },
      },
    });
    const data = administrators.map((administrator) => {
      const { user } = administrator;
      return {
        id: administrator.id,
        fullName: administrator.fullName,
        email: user.email,
        profilePhoto: administrator.profilePhoto,
        phoneNumber: administrator.phoneNumber,
        gender: administrator.gender,
        authProvider: user.authProvider,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updated: administrator.updatedAt,
      };
    });
    const meta = {
      page,
      limit,
      skip,
      totalResult,
      total,
    };
    return {
      data,
      meta,
    };
  });
const softDeleteUserByIdIntoDB = (authUser, id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    id = Number(id);
    // Check user existence
    const user = yield prisma_1.default.user.findUnique({
      where: {
        id,
        status: {
          not: client_1.UserStatus.DELETED,
        },
      },
    });
    if (!user) {
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        "User not found",
      );
    }
    const result = yield prisma_1.default.$transaction((txClient) =>
      __awaiter(void 0, void 0, void 0, function* () {
        yield txClient.user.update({
          where: {
            id,
          },
          data: {
            status: client_1.UserStatus.DELETED,
          },
        });
        yield txClient.administratorActivityLog.create({
          data: {
            administratorId: authUser.administratorId,
            action: `User (ID: ${id}) has been deleted.`,
          },
        });
      }),
    );
    return null;
  });
const createAdministratorIntoDB = (authUser, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
      where: {
        email: payload.email,
      },
    });
    // Checking user existence
    if (user) {
      throw new AppError_1.default(
        http_status_1.default.NOT_FOUND,
        "User is already exist using this email",
      );
    }
    const result = yield prisma_1.default.$transaction((txClient) =>
      __awaiter(void 0, void 0, void 0, function* () {
        const hashedPassword = yield (0, bycrypt_1.bcryptHash)(
          payload.password,
        );
        // Create user
        const createdUser = yield txClient.user.create({
          data: {
            email: payload.email,
            role: payload.role,
            password: hashedPassword,
            authProvider: client_1.AuthProvider.EMAIL_PASSWORD,
          },
        });
        // Create staff
        const createAdministrator = yield txClient.administrator.create({
          data: {
            userId: createdUser.id,
            fullName: payload.fullName,
            profilePhoto: payload.profilePhoto,
            gender: payload.gender || null,
            phoneNumber: payload.phoneNumber || null,
          },
        });
        yield txClient.administratorActivityLog.create({
          data: {
            administratorId: authUser.administratorId,
            action: `New administrator (ID: ${createAdministrator.id}) has been created.`,
          },
        });
        return createAdministrator;
      }),
    );
    return result;
  });
const UserServices = {
  ChangeUserStatusIntoDB,
  getCustomersFromDB,
  getAdministratorsFromDB,
  softDeleteUserByIdIntoDB,
  createAdministratorIntoDB,
};
exports.default = UserServices;
