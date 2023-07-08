const userModel = require('../model/UserModel')
const argon2 = require('argon2')
var jwt = require('jsonwebtoken')
require('dotenv').config();

const createMessage = async(req, res) => {
    const body = req.body;

    
    let connect = userModel.connection();
    let lastMmessage = ""
    
    try {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY);

        let insert = "INSERT INTO messages (content, senderID, receiversID, socketID) VALUES (?,?,?,?);"
        let array = [body.content, decoded.id, body.receiversId, body.socketID]
        
     if (decoded !==""){
        
        let saveMessageRequest = userModel.select(insert, array, connect)
        
     }

    let select = "SELECT messages.id as id, messages.content as content, user.username as name, messages.socketID as socketID FROM messages JOIN user ON messages.senderID = user.id order by messages.id DESC LIMIT 1"
    const messageResult = await new Promise((resolve, reject) => {
        connect.execute(select, [], function (err, selectResult) {
          if (err) {
            reject(err);
          } else {
            resolve(selectResult);
          }
        });
      });

      lastMmessage = messageResult
    } catch (error) {
        console.log("mon test",error)
        return res.status(409).json({
            error: true,
            message: ["Une erreur s'est produite pendant l'enregistrement du message"]
        })
    }

    return res.status(200).json({
        error: true,
        message: [''],
        lastMessage:lastMmessage
    })
}

const getMessages = async(req, res) => {
    let connect = userModel.connection();
    let select = "SELECT messages.id as id, messages.content as content, user.username as name, messages.socketID as socketID FROM messages JOIN user ON messages.senderID = user.id;"
    
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

const getLastMessage = async(req, res) => {
    let connect = userModel.connection();
    let select = "SELECT messages.id as id, messages.content as content, user.username as name, messages.socketID as socketID FROM messages JOIN user ON messages.senderID = user.id order by messages.id DESC LIMIT 1"
    
    let lastMmessage = ""
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

          lastMessage = messageResult

    }catch(error){
        console.log(error)
        return res.status(409).json({
            message: 'Invalid token.',
        });
    }

    return res.status(200).json({
        error: true,
        message: [''],
        lastMessage : lastMessage
    })
}

module.exports = {
    createMessage,
    getMessages,
    getLastMessage
}