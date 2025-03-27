"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const profile_controller_1 = __importDefault(require("./profile.controller"));
const router = (0, express_1.Router)();
router.put(
  "/my",
  (0, auth_1.default)(Object.values(client_1.UserRole)),
  profile_controller_1.default.updateMyProfile,
);
const ProfileRouter = router;
exports.default = ProfileRouter;
