const userModel = require('../model/UserModel')
const argon2 = require('argon2')
var jwt = require('jsonwebtoken')
require('dotenv').config();

const createMessage = async(req, res) => {
    const body = req.body;
    
    let connect = userModel.connection();

    // const hash = await argon2.hash(body.password);
    
    try {
        // on lui demande de promesse afin de savoir si il va bien renvoyer les données
        // await new Promise((resolve, reject) => {
        //     // si l'execution a bien eu lieu 
        //     let result = connect.execute(insert,array,  function(err, results, fields) {
        //         // si lemail existe déjà on renvoi erreur dans le catch
        //         if (results.length > 0) {
        //             return reject(true)
        //         }
        //         // sinon il continue son bout de chemin
        //         return resolve(false)
        //     })
    
        // })
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY);
     if (decode !==""){
        let insert = "INSERT INTO message (message, senderID, receiverID) VALUES (?,?,?);"
        let array = [body.message, body.senderID, body.receiverID]
        let requete = userModel.select(insert, array, connect)
     }

        
    } catch (error) {
        return res.status(409).json({
            error: true,
            message: ["Une erreur s'est produite pendant l'enregistrement du message"]
        })
    }

  

    // rechercher les emails correspondant et mettre une erreur qui dit que l'email existe déjà 
    
    return res.status(200).json({
        error: true,
        message: ['']
    })
}


const getMessages = async(req, res) => {
    let connect = userModel.connection();
    let select = "SELECT * FROM messages;";
    let messages = []
    try{
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY);
        if(decoded===''){
            return res.status(409).json({
                message: 'Invalid token.',
            });
        }
        const messageResult = await new Promise((resolve, reject) => {
            connect.execute(select, [], function (err, selectResult) {
              if (err) {
                reject(err);
              } else {
                resolve(selectResult);
              }
            });
          });

          messages = messageResult

    }catch(error){
        console.log(error)
        return res.status(409).json({
            message: 'Invalid token.',
        });
    }

    return res.status(200).json({
        error: true,
        message: [''],
        messages : messages
    })
}

module.exports = {
    createMessage,
    getMessages
}