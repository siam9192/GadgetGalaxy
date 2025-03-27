"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const administratorActivityLog_controller_1 = __importDefault(
  require("./administratorActivityLog.controller"),
);
const router = (0, express_1.Router)();
router.get("/", administratorActivityLog_controller_1.default.getActivityLogs);
router.get(
  "/administrator/:id",
  administratorActivityLog_controller_1.default.getAdministratorActivityLogs,
);
router.delete(
  "/:id",
  administratorActivityLog_controller_1.default.deleteActivity,
);
const AdministratorActivityLogRouter = router;
exports.default = AdministratorActivityLogRouter;
