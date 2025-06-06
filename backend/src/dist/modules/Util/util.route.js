"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const util_controller_1 = __importDefault(require("./util.controller"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.get("/search-keyword/:keyword", util_controller_1.default.getSearchKeywordResults);
const UtilRouter = router;
router.get("/my-count", (0, auth_1.default)(Object.values(client_1.UserRole)), util_controller_1.default.getUtilCounts);
exports.default = UtilRouter;
