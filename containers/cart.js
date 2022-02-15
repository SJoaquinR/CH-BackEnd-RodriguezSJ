class ContainerCart {
    constructor() {
        this.cart = []
        this.id = 0
    }

    list(id) {
        const cart = this.cart.find(cart => cart.id == id)
        return cart || { error: `Carrito no encontrado` }
    }

    listAll() {
        return [...this.cart]
    }

    save(cart) {
        const newCart = { ...cart, id: 1 }
        this.cart.push(newCart)
        return { msg: "Producto Agregado al carrito", data: newCart }
    }

    create(cart) {
        const newCart = cart
        const response = { id: ++this.id, newCart }
        this.cart.push(response)
        return response.id
    }

    delete(id) {
        const index = this.cart.findIndex(product => product.id == id)
        if (index !== -1) {
            return { msg: "Producto Eliminado del carrito", data: this.cart.splice(index, 1) }
        } else {
            return { error: `Carrito no encontrado` }
        }
    }

    deleteAll() {
        this.cart = []
    }
}

module.exports = ContainerCart
