const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const io = require('socket.io')
const http = require('http');
const { Socket } = require('dgram');

app.use(cors());
//lancer le serveur socket
const server = http.createServer(app);
const io = socket(server, {
    cors: {
        origin: "http://localhost:5173/",
    }
})

io.on('connection', (socket) => {
    console.log(`New User connected: ${socket.id}`);
})
app.get('/', (req, res) => {
    res.send('Hello, welcome to my server');})

    app.listen(port, () => {
        console.log(`Server online on port http://localhost:${port}`)
    })