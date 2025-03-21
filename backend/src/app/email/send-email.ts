import transporter from "./nodemailer.config";

const sendEmail = async (to: string, subject: string, template: string) => {
  return await transporter.sendMail({
    from: "tech.tinker.lab@gmail.com",
    to: to,
    subject: subject,
    html: template,
  });
};

export default sendEmail;
