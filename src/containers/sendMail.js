const { createTransport } = require("nodemailer");
const globalUserApi = require("../apis/globalUserApi.js");
const logger = require("../utils/logger.js");

const EMAIL_SERVICE = process.env.EMAIL_SERVICE;
const PASS_EMAIL = process.env.PASS_EMAIL;
const EMAIL_SEND = globalUserApi.getEmailSend();

const transporter = createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: EMAIL_SERVICE,
    pass: PASS_EMAIL,
  },
});

class ContainerSendMail {
  constructor() {}

  enviarCorreo(datosUsuario) {
    const emailContent = {
      from: "NodeJS app <noreply@example.com>",
      to: `"nuevo registro!👨‍💻" ${EMAIL_SEND}`,
      subject: "nuevo registro ✔",
      text: "nuevo registro!",
      html: `<h1 style="color: blue;">Datos del usuario: <span style="color: green;">${datosUsuario}</span></h1>`,
    };
    try {
      transporter.sendMail(emailContent, async (err, info) => {
        if (err) {
          logger.warn(`Error en el envio de email: ${err}`);
        } else {
          logger.info(`Email sent: ${info.response}`);
        }
      });
    } catch (error) {
      logger.warn(error);
    }
  }
}

module.exports = ContainerSendMail;
