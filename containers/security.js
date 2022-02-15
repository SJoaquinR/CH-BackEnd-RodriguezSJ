class ContainerAdministrator {
  constructor() {
    this.admin = true;
  }

  roleAdmin() {
    return this.admin;
  }

  notAutorized(method, url) {
    return {
      error: -1,
      descripcion: `La ruta '${url}' método '${method}' no autorizada`,
    };
  }
}

module.exports = ContainerAdministrator;
