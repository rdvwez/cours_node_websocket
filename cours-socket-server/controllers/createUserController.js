const userModel = require('../model/UserModel')
const argon2 = require('argon2')
var jwt = require('jsonwebtoken')
require('dotenv').config();

const createUser = async(req, res) => {
    console.log('Bien recu coté server')
    const body = req.body;

    let select = "SELECT * FROM user WHERE username = ?;"
    let connect = userModel.connection();

    const hash = await argon2.hash(body.password);

    try {
        await new Promise((resolve, reject) => {
            // si l'execution a bien eu lieu 
            let result = connect.execute(select,[body.username],  function(err, results, fields) {
                // si lemail existe déjà on renvoi erreur dans le catch
                if (results.length > 0) {
                    return reject(true)
                }
                // sinon il continue son bout de chemin
                return resolve(false)
            })
    
        })

        
    } catch (error) {
        return res.status(409).json({
            error: true,
            message: ["L'utilisateur a déjà un compte"]
        })
    }

    let sql = "INSERT INTO user (username, password) VALUES (?,?);"
    let array = [body.username, hash]
    let requete = userModel.select(sql, array, connect)

    var token = jwt.sign({ username: body.username , id:resultat[0].id}, process.env.JWT_SECRET_KEY);
    userModel.disconnect(connect)

    return res.status(200).json({
        error: true,
        message: [''],
        token : token
    })
}

module.exports = {
    createUser
}