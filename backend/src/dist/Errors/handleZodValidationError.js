"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleZodValidationError = void 0;
const HandleZodValidationError = (err) => {
  const statusCode = 400;
  const errorMessages = err.issues.map((issue) => {
    return {
      path: issue.path.at(-1) || "",
      message: issue.message,
    };
  });
  return {
    statusCode,
    message: err.message,
    errorMessages,
  };
};
exports.HandleZodValidationError = HandleZodValidationError;
