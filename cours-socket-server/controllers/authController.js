const userModel = require('../model/UserModel')
const argon2 = require('argon2')
var jwt = require('jsonwebtoken')
require('dotenv').config();

const AuthLogin = async(req, res) => {

    // console.log('NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOONNNNNNNNNNNNNNNNNNNNNNN')
    const body = req.body;
    
    let select = "SELECT * FROM user WHERE username = ?;"
    
    let connect = userModel.connection();
    
    try {
        // on lui demande de promesse afin de savoir si il va bien renvoyer les données
        const resultat = await new Promise((resolve, reject) => {
            // si l'execution a bien eu lieu 
            
            let result = connect.execute(select,[body.username],  function(err, results, fields) {
                // si lemail existe déjà on renvoi erreur dans le catch
                // console.log(results)
                if (results.length > 0) {
                    return resolve(results)
                }
                // sinon il continue son bout de chemin
                return reject(true)
            })
    
        })
        // console.log(resultat)
        if (!await argon2.verify(resultat[0].password, body.password)) {
            return res.status(409).json({
                error: true,
                message: ["Password/User incorrecte"]
            })
        } 

        var token = jwt.sign({ username: resultat[0].username , id:resultat[0].id}, process.env.JWT_SECRET_KEY);
        let updateUser = "UPDATE user SET status = ? WHERE id = ?;";
        let array = [1, resultat[0].id]
        let requete = userModel.select(updateUser, array, connect)

            
    } catch (error) {
        return res.status(409).json({
            error: true,
            message: ["Password/User "],
        })
    } 


    // rechercher les emails correspondant et mettre une erreur qui dit que l'email existe déjà 
    
    return res.status(200).json({
        error: true,
        message: [''],
        token : token

    })
}

module.exports = {
    AuthLogin
}