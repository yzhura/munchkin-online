const path = require('path');

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 8080;

// const SocketManager = require('./SocketManager')

// const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const NEW_SKILLS_EVENT = "newSkillsEvent";
const NEW_ROOM_CONNECTION = "newRoomConnection";
const ROOM_IS_DELETED = "roomIsDeleted";
const USER_DISCONNECT = "userDisconnect";
const GENERATE_CUBIC_NUMBER = "generateNumber";

let connections = [];
// 1 hr. = 3600000 ms
const timer = 3600000 * 6;

app.use(express.static(path.join(__dirname, '../../build')));

app.get("*", (req, res) => {
  let url = path.join(__dirname, '../../build', 'index.html');
  if (!url.startsWith('/app/')) // since we're on local windows
    url = url.substring(1);
  res.sendFile(url);
});

function RoomConstructor(roomName, roomTimer) {
  this.roomName = roomName;
  this.users = [];
  this.timer = roomTimer;
  this.cubic = 1;
  this.generateCubicNumber = function () {
    this.cubic = Math.ceil(Math.random() * 6);
  }
}

io.on("connection", (socket) => {
  // Join a conversation
  const { roomId } = socket.handshake.query;

  socket.join(roomId);

  let connectedRoom = connections.find((el) => {
    return el.roomName === roomId
  });

  if (!connectedRoom) {
    connections.push(new RoomConstructor(roomId, timer));

    connectedRoom = connections.find((el) => {
      return el.roomName === roomId
    });

    let intervaiId = setInterval(() => {
      connectedRoom.timer = connectedRoom.timer - 1000
    }, 1000)

    let deleteRoomAfter = new Promise((resolve, reject) => {
      setTimeout(() => {
        let newConnections = connections.filter((el) => {
          return el.roomName !== roomId
        });
        resolve(newConnections);
      }, timer)
    })

    deleteRoomAfter
      .then((result) => {
        console.log('result: ', result);
        console.log("connections ", connections);
        connections = [...result]
        console.log('new connections: ', connections);
        clearInterval(intervaiId);
        io.in(roomId).emit(ROOM_IS_DELETED, true);
      });
  }

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  socket.on(GENERATE_CUBIC_NUMBER, () => {
    connectedRoom.generateCubicNumber();
    io.in(roomId).emit('generateNumber', connectedRoom.cubic);
  });

  socket.on(NEW_SKILLS_EVENT, (userSkills) => {
    const {userLevel, userStrength, userId} = userSkills;

    connectedRoom.users.forEach((el) => {
      if(el.id === userId) {
        el.level = userLevel;
        el.strength = userStrength;
      }
    })

    io.emit(NEW_ROOM_CONNECTION, connectedRoom);
  });

  socket.on(NEW_ROOM_CONNECTION, (data) => {

    let isUserConnect = connectedRoom.users.find((el) => {
      return el.id === data.id;
    })

    if(isUserConnect) {
      io.emit(NEW_ROOM_CONNECTION, connectedRoom);
      return;
    }

    if(connectedRoom.users.length >= 10) {
      io.emit(NEW_ROOM_CONNECTION, connectedRoom, true, data.id);
      socket.leave(roomId);
      return;
    }

    connectedRoom.users.push(data);

    io.emit(NEW_ROOM_CONNECTION, connectedRoom);
  });

  socket.on(USER_DISCONNECT, (userId) => {

    const posOfUser = connectedRoom.users.findIndex((el) => {
      return el.id === userId;
    });

    if(posOfUser >= 0) {
      connectedRoom.users.splice(posOfUser, 1);
      io.emit(NEW_ROOM_CONNECTION, connectedRoom);
    }

  })

  socket.on('connect', () => {

  });

  // Leave the room if the user closes the socket
  socket.on('disconnect', (reason) => {
    socket.leave(roomId);
  });

});

server.listen(port);
