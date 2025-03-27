"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const response_1 = require("./shared/response");
const app = (0, express_1.default)();
app.use(
  (0, cors_1.default)({ origin: ["http://localhost:3000"], credentials: true }),
);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/v1", routes_1.default);
app.use((err, req, res, next) => {
  console.log(err);
  (0, response_1.sendErrorResponse)(res, {
    statusCode: err.statusCode || 500,
    message: err.message || "Something went wrong",
  });
});
app.use((req, res) => {
  if (req.url === "/") {
    res.status(200).json({
      message: "Hey welcome to  server",
    });
  }
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Not Found",
  });
});
exports.default = app;
