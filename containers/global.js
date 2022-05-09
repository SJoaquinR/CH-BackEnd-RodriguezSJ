class ContainerGlobal {
  name;
  constructor() {}
  get(){
    return this.name;
  }

  save(name) {
    try {
      this.name = name;
      return this.name;
    } catch (error) {
      return { error: `No se pudo guardar el nombre del usuario` };
    }
  }
}

module.exports = ContainerGlobal;
