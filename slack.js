const express = require("express");
const path = require("node:path");
const app = express();
const socketio = require("socket.io");
const namespaces = require("./data/namespaces");
const Room = require("./classes/Room");
app.use(express.static(__dirname + "/public"));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "slack.html"));
});
const expressServer = app.listen(9000);
const io = socketio(expressServer);
app.get("/change-ns", (req, res) => {
  namespaces[0].addRoom(new Room(0, "Deleted Articles", 0));
  // let other know the change
  io.of(namespaces[0].endpoint).emit("nsChange", namespaces[0]);
  res.json(namespaces[0]);
});
io.on("connection", (socket) => {
  // console.log("=============");
  // console.log(socket.handshake);
  socket.on("clientConnect", (data) => {
    // console.log(`${socket.id} has connected`);
    socket.emit("nsList", namespaces);
  });
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connection", (socket) => {
    // console.log(`${socket.id} has connected to ${namespace.endpoint}`);
    socket.on("joinRoom", async ({ roomTitle, namespaceId }, ackCallback) => {
      //   console.log(data);
      const thisNs = namespaces[namespaceId];
      const thisRoomObj = thisNs.rooms.find(
        (room) => room.roomTitle === roomTitle
      );
      const thisRoomHistory = thisRoomObj.history;
      const rooms = socket.rooms;
      //   console.log(rooms);
      let i = 0;
      rooms.forEach((room) => {
        if (i !== 0) {
          socket.leave(room);
        }
        i++;
      });
      socket.join(roomTitle);
      const sockets = await io
        .of(namespace.endpoint)
        .in(roomTitle)
        .fetchSockets();
      //   console.log(sockets);
      const socketsCount = sockets.length;
      //   console.log(socketsCount);
      ackCallback({
        numUsers: socketsCount,
        history: thisRoomHistory,
      });
    });
    socket.on("newMessageToRoom", (newMessageObj) => {
      // console.log(newMessageObj);
      // find the current room
      const rooms = socket.rooms;
      // console.log(rooms);
      const currentRoom = Array.from(rooms)[1]; // print the result if unsure
      // console.log("111", currentRoom);
      io.of(namespace.endpoint)
        .in(currentRoom)
        .emit("messageToRoom", newMessageObj);
      //
      const thisNs = namespaces[newMessageObj.namespaceId];
      const thisRoom = thisNs.rooms.find(
        (room) => room.roomTitle === currentRoom
      );
      // console.log("22", thisRoom);
      thisRoom.addMessage(newMessageObj);
    });
  });
});
