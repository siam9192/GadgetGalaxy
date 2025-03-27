"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleCastError = void 0;
const HandleCastError = (err) => {
  const statusCode = 400;
  const errorMessages = [
    {
      path: err.path || "",
      message: err.message || "",
    },
  ];
  return {
    statusCode,
    message: err === null || err === void 0 ? void 0 : err.message,
    errorMessages,
  };
};
exports.HandleCastError = HandleCastError;
