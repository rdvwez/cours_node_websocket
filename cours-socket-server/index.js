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

let users = [];
const instance = axios.create();
instance.defaults.headers.common['Authorization'] = `Bearer ${DEV_AUTH_TOKEN}`;
instance.defaults.baseURL = 'http://localhost:3001';
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
instance('/user')
        .then((response) => {
          const fetchedUsers = response.data.users;
          users = fetchedUsers.filter((user)=>{
            return user.status ==1
          })
          console.log(users);

        })
        .catch((error) => {
          console.log(error);
        
        });
io.on("connection", (socket) => {
    // transmet l'id lors d'une connection
    console.log(`User connected : ${socket.id}`);

    socket.on('new_user', (data) => {
      io.emit('receive_users', users);
    });

    // Me permet de récupérer les messages du client
    socket.on("send_message", (data) => {
     
      console.log(data);
    
      instance.post('/message', {
        content: data.content,
        receiversId: `[${data.receiversId}]`,
        socketID: data.socketID
      }, {
        headers: {
          'Authorization': `Bearer ${data.token}`,
        }
      })
      .then((response) => {
        io.emit("receive_message", data);

      })
      .catch((error) => {
        console.log(error);
      });

    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
      socket.disconnect();
    });
});

// On lance le serveur
server.listen(3001, () => {
    console.log('SERVER IS RUNNING ON 3001');
});