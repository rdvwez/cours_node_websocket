var mysql      = require('mysql2');
require('dotenv').config();

const connection = () => {
    let connection =  mysql.createConnection({
        host     : process.env.HOSTNAME,
        user     : process.env.DB_USERNAME,
        password : process.env.PASSWORD,
        database : process.env.DB_NAME
    });
    connection.connect();

    return connection;
}

const disconnect = (connection) => { 
    return connection.end();
}

const select = (select, array, connection) => {
    let data =  connection.query(select,array, (e, r, f ) => {
        if (e) throw e
    })
    return data
}

module.exports = {
    select,
    disconnect,
    connection
}
