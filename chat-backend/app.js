const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const socket = require('socket.io');
const http = require('http');

app.use(cors());

const server = http.createServer(app);
const io = socket(server, {
  cors: { origin: 'http://127.0.0.1:5173' },
});

let socketsConnected = new Set();
let users = {};

io.on('connection', (socket) => {
  console.log(`New user connected: ${socket.id}`);
  socketsConnected.add(socket.id);

  io.emit('userCount', socketsConnected.size);

  socket.on('message', (message) => {
    io.emit('message', message);
  });

  socket.on('privateMessage', (message) => {
    const recipientSocket = io.sockets.sockets.get(message.recipientId);
    if (recipientSocket) {
      recipientSocket.emit('privateMessage', message);
    }
  });

  socket.on('typing', (user) => {
    if (user && user.recipientId) {
      const recipientSocket = io.sockets.sockets.get(user.recipientId);
      if (recipientSocket) {
        recipientSocket.emit('typing', user);
      }
    } else {
      socket.broadcast.emit('typing', user);
    }
  });

  socket.on('stopTyping', (user) => {
    if (user && user.recipientId) {
      const recipientSocket = io.sockets.sockets.get(user.recipientId);
      if (recipientSocket) {
        recipientSocket.emit('stopTyping', user);
      }
    } else {
      socket.broadcast.emit('stopTyping', user);
    }
  });

  socket.on('setUsername', (username) => {
    users[socket.id] = username;
    io.emit('updateUserList', users);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    socketsConnected.delete(socket.id);
    delete users[socket.id];
    io.emit('updateUserList', users);
    io.emit('userCount', socketsConnected.size);
  });
});

app.get('/', (req, res) => {
  res.send('Hello, welcome to my server');
});

server.listen(port, () => {
  console.log(`Server online on port http://localhost:${port}`);
});
