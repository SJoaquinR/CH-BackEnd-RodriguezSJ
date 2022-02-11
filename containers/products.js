class ContainerProducts {
    constructor() {
        this.products = []
        this.id = 0
    }

    list(id) {
        const product = this.products.find(product => product.id == id)
        return product || { error: `Producto no encontrado` }
    }

    listAll() {
        return [...this.products]
    }

    save(product) {
        const newproduct = { ...product, id: ++this.id }
        this.products.push(newproduct)
        return { msg: "Producto Agregado", data: newproduct }
    }

    update(product, id) {
        const newproduct = { id: Number(id), ...product }
        const index = this.products.findIndex(p => p.id == id)
        if (index !== -1) {
            this.products[index] = newproduct
            return { msg: "Producto actualizado", data: newproduct }
        } else {
            return { error: `Producto no encontrado` }
        }
    }

    delete(id) {
        const index = this.products.findIndex(product => product.id == id)
        if (index !== -1) {
            return { msg: "Producto Eliminado", data: this.products.splice(index, 1) }
        } else {
            return { error: `Producto no encontrado` }
        }
    }

    deleteAll() {
        this.products = []
    }
}

module.exports = ContainerProducts
