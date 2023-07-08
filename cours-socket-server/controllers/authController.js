const userModel = require('../model/UserModel')
const argon2 = require('argon2')
var jwt = require('jsonwebtoken')
require('dotenv').config();

const AuthLogin = async(req, res) => {

    const body = req.body;
    
    let select = "SELECT * FROM user WHERE username = ?;"
    
    let connect = userModel.connection();
    
    try {
        const resultat = await new Promise((resolve, reject) => {
            
            let result = connect.execute(select,[body.username],  function(err, results, fields) {

                if (results.length > 0) {
                    return resolve(results)
                }
                // sinon il continue son bout de chemin
                return reject(true)
            })
    
        })
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
    return res.status(200).json({
        error: true,
        message: [''],
        token : token

    })
}


const AuthLogout = async (req, res) => {
    let updateUser = "UPDATE user SET status = ? WHERE id = ?;";
    let connect = userModel.connection();
  
    try {
      const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY);
  
      await new Promise((resolve, reject) => {
        connect.execute(updateUser, [0, decoded.id], function (err, results, fields) {
          if (err) {
            return reject(err);
          }
          return resolve();
        });
      });
  
      return res.status(200).json({
        error: false,
        message: ['User successfully disconnected'],
      });
    } catch (error) {
      return res.status(409).json({
        error: true,
        message: ["Invalid Token"],
      });
    }
  };

module.exports = {
    AuthLogin,
    AuthLogout
}