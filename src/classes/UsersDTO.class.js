class UsersDTO {
    constructor(name, email){
        this.name = name;
        this.email = email;
    }

    getName(){
        return this.name;
    }

    setName(name){
        return this.name = name;
    }

    getEmail(){
        return this.email;
    }

    setEmail(email){
        return this.email = email;
    }
}

module.exports = UsersDTO;