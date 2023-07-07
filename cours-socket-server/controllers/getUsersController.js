const userModel = require('../model/UserModel')
const argon2 = require('argon2')
var jwt = require('jsonwebtoken')
require('dotenv').config();


const getUsers = async(req, res) => {
    let connect = userModel.connection();
    let select = "SELECT id, username, status, socketID FROM user;";
    let users = []
    try{
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY);
        if(decoded===''){
            return res.status(409).json({
                message: 'Invalid token.',
            });
        }
        const userResult = await new Promise((resolve, reject) => {
            connect.execute(select, [], function (err, selectResult) {
              if (err) {
                reject(err);
              } else {
                resolve(selectResult);
              }
            });
          });

       
        users = userResult

    }catch(eror){
        return res.status(409).json({
            message: 'Invalid token.',
        });
    }

    return res.status(200).json({
        error: true,
        message: [''],
        users : users
    })
}

module.exports = {
    getUsers
}