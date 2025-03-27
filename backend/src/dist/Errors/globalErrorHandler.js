"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalErrorHandler = void 0;
const handleCastError_1 = require("./handleCastError");
const handleZodValidationError_1 = require("./handleZodValidationError");
const handleValidationError_1 = require("./handleValidationError");
const AppError_1 = __importDefault(require("./AppError"));
const zod_1 = require("zod");
const config_1 = __importDefault(require("../config"));
const handleDuplicateError_1 = require("./handleDuplicateError");
const GlobalErrorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorMessages = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];
  if ((err === null || err === void 0 ? void 0 : err.name) === "CastError") {
    const errHandler = (0, handleCastError_1.HandleCastError)(err);
    statusCode = errHandler.statusCode;
    (message = errHandler.message), (errorMessages = errHandler.errorMessages);
  } else if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
    const errHandler = (0, handleDuplicateError_1.HandleDuplicateError)(err);
    statusCode =
      errHandler === null || errHandler === void 0
        ? void 0
        : errHandler.statusCode;
    message =
      errHandler === null || errHandler === void 0
        ? void 0
        : errHandler.message;
    errorMessages =
      errHandler === null || errHandler === void 0
        ? void 0
        : errHandler.errorMessages;
  } else if (err instanceof zod_1.ZodError) {
    const errHandler = (0, handleZodValidationError_1.HandleZodValidationError)(
      err,
    );
    statusCode = errHandler.statusCode;
    (message = errHandler.message), (errorMessages = errHandler.errorMessages);
  } else if (
    (err === null || err === void 0 ? void 0 : err.name) === "ValidationError"
  ) {
    const errHandler = (0, handleValidationError_1.HandleValidationError)(err);
    statusCode = errHandler.statusCode;
    (message = errHandler.message), (errorMessages = errHandler.errorMessages);
  } else if (err instanceof AppError_1.default) {
    statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
    message = err.message;
    errorMessages = [
      {
        path: "",
        message: err === null || err === void 0 ? void 0 : err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorMessages = [
      {
        path: "",
        message: err === null || err === void 0 ? void 0 : err.message,
      },
    ];
  }
  return res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack:
      config_1.default.NODE_ENV === "development"
        ? err === null || err === void 0
          ? void 0
          : err.stack
        : null,
  });
};
exports.GlobalErrorHandler = GlobalErrorHandler;
