const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const http = require('http');
const {Server} = require('socket.io');
const axios = require('axios');
const cors = require('cors');
var jwt = require('jsonwebtoken')

const userModel = require('./model/UserModel')
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const messageRoutes = require('./routes/messageRoutes')

//Initialisation du serveur
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/message', messageRoutes);

//create a dev user token 
var DEV_AUTH_TOKEN = jwt.sign({ username: 'dev' , id:1000}, process.env.JWT_SECRET_KEY);

const server = http.createServer(app); 
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

let connect = userModel.connection();

// let select = "SELECT username FROM user WHERE status = 1;"
// let requete = userModel.select(select, [], connect)
let users = [];
const instance = axios.create();
instance.defaults.headers.common['Authorization'] = `Bearer ${DEV_AUTH_TOKEN}`;
instance.defaults.baseURL = 'http://localhost:3001';
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
instance('/user')
        .then((response) => {
          // console.log(response.data.users)
          const fetchedUsers = response.data.users;
          const users = fetchedUsers.filter((user)=>{
            return user.status ==1
          })
          console.log(users);
          // const token = response.data.token;
          // localStorage.setItem('token', token);
          // localStorage.setItem('username', username);
          
          // socket.emit('new_user', {username, socketID: socket.id});
          // navigate('/chat');

        })
        .catch((error) => {
          // setError(error.response.data.message)
          console.log(error);
        
        });
io.on("connection", (socket) => {
    // transmet l'id lors d'une connection
    console.log(`User connected : ${socket.id}`);

    socket.on('new_user', (data) => {
      // users.push(data.);
      // console.log(data);
      // console.log(requete);
      io.emit('receive_users', users);
    });

    // Me permet de récupérer les messages du client
    socket.on("send_message", (data) => {
      console.log(data);
      // const decoded = jwt.verify(data.token.split(' ')[1], process.env.JWT_SECRET_KEY);
      instance.post('/message',
      {
        message: data.text,
        // senderID: decoded.id,
      })
        .then((response) => {
          console.log(">>>>>>Apres requete",response)
          
         
          
          

        })
        .catch((error) => {
          console.log(error);
        });


      io.emit("receive_message", data)
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
      users = users.filter((user) => user.socketID !== socket.id);
      socket.emit('receive_users', users);
      socket.disconnect();
    });
});

// On lance le serveur
server.listen(3001, () => {
    console.log('SERVER IS RUNNING ON 3001');
});