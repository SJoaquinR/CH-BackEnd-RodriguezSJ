class ContainerGlobal {
  name;
  EMAIL_SEND= process.env.EMAIL_SEND;
  EMAIL_CONTACT_NUMBER=process.env.EMAIL_CONTACT_NUMBER;

  constructor() {}
  async get(){
    return await this.name;
  }

  save(name) {
    try {
      this.name = name;
      return this.name;
    } catch (error) {
      return { error: `No se pudo guardar el nombre del usuario` };
    }
  }

  getEmailSend() {
    return this.EMAIL_SEND;
  }

  saveEmailSend(emailSend) {
    try {
      this.EMAIL_SEND = emailSend;
      return this.EMAIL_SEND;
    } catch (error) {
      return { error: `No se pudo guardar el email del usuario` };
    }
  }

  getEmailContactNumber() {
    return this.EMAIL_CONTACT_NUMBER;
  }

  saveEmailContactNumber(emailContactNumber) {
    try {
      this.EMAIL_CONTACT_NUMBER = emailContactNumber;
      return this.EMAIL_CONTACT_NUMBER;
    } catch (error) {
      return { error: `No se pudo guardar el telefono del usuario` };
    }
  }
}

module.exports = ContainerGlobal;
