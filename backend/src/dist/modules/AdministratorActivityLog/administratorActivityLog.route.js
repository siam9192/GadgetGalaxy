"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const administratorActivityLog_controller_1 = __importDefault(require("./administratorActivityLog.controller"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
router.get("/", (0, auth_1.default)([client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN]), administratorActivityLog_controller_1.default.getActivityLogs);
router.get("/administrator/:id", (0, auth_1.default)([client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN]), administratorActivityLog_controller_1.default.getAdministratorActivityLogs);
router.delete("/:id", (0, auth_1.default)([client_1.UserRole.SUPER_ADMIN]), administratorActivityLog_controller_1.default.deleteActivity);
const AdministratorActivityLogRouter = router;
exports.default = AdministratorActivityLogRouter;
