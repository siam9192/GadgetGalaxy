import ejs from "ejs";
import AppError from "../Errors/AppError";
import sendEmail from "./send-email";
import path from "path";
const sendAccountRecoverEmail = (
  receiver: string,
  receiverName: string,
  otp: string,
) => {
  return ejs.renderFile(
    path.join(process.cwd(), "/src/app/templates/account-recover-email.ejs"),
    { name: receiverName, otp },
    async function (err, template) {
      if (err) {
        throw new AppError(400, "Something went wrong");
      } else {
        await sendEmail(receiver, "Verify your account", template);
      }
    },
  );
};
export default sendAccountRecoverEmail;
