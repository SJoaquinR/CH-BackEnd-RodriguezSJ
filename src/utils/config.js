const dotenv = require('dotenv');
dotenv.config();

const config = {
    mongodb: {
        connstr: `mongodb://${process.env.HOSTDB || 'localhost'}:${process.env.PORTDB || 27017}/ecommerce`,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        }
    },
    firebase: {
        rutaCert: '../../db/./certificado.json',
    },
    filedb: {
        pathdb: './DB'
    },
    srv: {
        port: process.env.PORT,
        logger: process.env.NODE_ENV || 'DEV',
        persistencia: 'memoria'
    }
}

module.exports = config;