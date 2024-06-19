const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const socket = require('socket.io')
const http = require('http');

app.use(cors());
//lancer le serveur socket
const server = http.createServer(app);
const io = socket(server, {
    cors: {
        origin: "http://127.0.0.1:5173"}
});

// Créér des tableaux
let socketsConnected = new Set();
let users = {};

// on créée un évènement sur le serveur, lorsque un user est connecté, on console log, on rajoute les id dans un tableau.
// Et on peut créér différents évènements sur le serveur
io.on('connection', (socket) => {
    console.log(`New User connected: ${socket.id}`);
    socketsConnected.add(socket.id);

    // Je transmet le nombre de sockets ou clients connectés au serveur
    io.emit('userCount', socketsConnected.size);
    console.log(socketsConnected.size);

    // Je retransmet a tout le monde, lorsqu'un user individuel est setUsername
    socket.on('setUsername', (username) => {
        users[socket.id] = username;
        io.emit('updateUserList', users);
    });


    //Nous allons gérer la déconnexion des users :
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        socketsConnected.delete(socket.id);
        delete users[socket.id];
        io.emit('userCount', socketsConnected.size);
        io.emit('updateUserList', users);
    })
});

app.get('/', (req, res) => {
    res.send('Hello, welcome to my server');})

    server.listen(port, () => {
        console.log(`Server online on port http://localhost:${port}`)
    })