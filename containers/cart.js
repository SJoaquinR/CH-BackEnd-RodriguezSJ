class ContainerCart {
    constructor() {
        this.cart = []
        this.id = 0
    }

    list(id) {
        const product = this.cart.find(product => product.id == id)
        return product || { error: `Producto no encontrado` }
    }

    listAll() {
        return [...this.cart]
    }

    save(product) {
        const newproduct = { ...product, id: ++this.id }
        this.cart.push(newproduct)
        return { msg: "Producto Agregado", data: newproduct }
    }

    update(product, id) {
        const newproduct = { id: Number(id), ...product }
        const index = this.cart.findIndex(p => p.id == id)
        if (index !== -1) {
            this.cart[index] = newproduct
            return { msg: "Producto actualizado", data: newproduct }
        } else {
            return { error: `Producto no encontrado` }
        }
    }

    delete(id) {
        const index = this.cart.findIndex(product => product.id == id)
        if (index !== -1) {
            return { msg: "Producto Eliminado", data: this.cart.splice(index, 1) }
        } else {
            return { error: `Producto no encontrado` }
        }
    }

    deleteAll() {
        this.cart = []
    }
}

module.exports = ContainerCart
