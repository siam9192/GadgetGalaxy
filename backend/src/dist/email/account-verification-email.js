"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const ejs_1 = __importDefault(require("ejs"));
const AppError_1 = __importDefault(require("../Errors/AppError"));
const send_email_1 = __importDefault(require("./send-email"));
const path_1 = __importDefault(require("path"));
const sendAccountRecoverEmail = (receiver, receiverName, otp) => {
  return ejs_1.default.renderFile(
    path_1.default.join(
      process.cwd(),
      "/src/app/templates/account-recover-email.ejs",
    ),
    { name: receiverName, otp },
    function (err, template) {
      return __awaiter(this, void 0, void 0, function* () {
        if (err) {
          throw new AppError_1.default(400, "Something went wrong");
        } else {
          yield (0, send_email_1.default)(
            receiver,
            "Verify your account",
            template,
          );
        }
      });
    },
  );
};
exports.default = sendAccountRecoverEmail;
