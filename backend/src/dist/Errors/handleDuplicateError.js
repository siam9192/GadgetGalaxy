"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleDuplicateError = void 0;
const HandleDuplicateError = (err) => {
  // Extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);
  // The extracted value will be in the first capturing group
  const extractedMessage = match && match[1];
  const errorMessages = [
    {
      path: "",
      message: (err === null || err === void 0 ? void 0 : err.message) || "",
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: err === null || err === void 0 ? void 0 : err.message,
    errorMessages,
  };
};
exports.HandleDuplicateError = HandleDuplicateError;
