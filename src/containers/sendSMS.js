const twilio = require("twilio");
const logger = require("../utils/logger.js");

const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const from_number = process.env.FROM_NUMBER;

const client = twilio(accountSid, authToken);

try {
  const numbers = process.env.EMAIL_CONTACT_NUMBER;
  sendSMS();
  async function sendSMS() {
    const message = await client.messages.create({
      body: "Hola Saludos desde la clase 28220 Node.js 😎!",
      from: from_number,
      to: numbers,
    });
    logger.info(`Mensaje enviado: ${JSON.stringify(message, null, 2)}`);
  }
} catch (error) {
  logger.warn(error);
}
