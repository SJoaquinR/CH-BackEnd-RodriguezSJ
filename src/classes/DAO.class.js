const CustomError = require('./CustomError.class.js');

class DAO {
    async listAll(){
        throw new CustomError(500, "Falta implementar 'listAll' en Sub Clase")
    }

    async list(){
        throw new CustomError(500, "Falta implementar 'list' en Sub Clase")
    }

    async save(){
        throw new CustomError(500, "Falta implementar 'save' en Sub Clase")
    }

    async update(){
        throw new CustomError(500, "Falta implementar 'update' en Sub Clase")
    }

    async delete(){
        throw new CustomError(500, "Falta implementar 'delete' en Sub Clase")
    }
}

module.exports = DAO;