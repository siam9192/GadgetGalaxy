"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleValidationError = void 0;
const HandleValidationError = (err) => {
  const statusCode = 400;
  const errorMessages = Object.keys(err.errors).map((issue) => {
    return {
      path: err.errors[issue].path,
      message: err.errors[issue].message,
    };
  });
  return {
    statusCode,
    message: err.message,
    errorMessages,
  };
};
exports.HandleValidationError = HandleValidationError;
