import express from "express";
import http from "http";
import { Server as SocketIO } from "socket.io";

const app = express();
const httpServer = http.createServer(app);
const io = new SocketIO(httpServer);
const PORT = process.env.PORT || 3000;

let connections = [];

io.on("connect", (socket) => {
  connections.push(socket);
  console.log(`Connected: ${connections.length} sockets connected`);
  console.log(`${socket.id}`);

  socket.on("draw", (data) => {
    connections.forEach((s) => {
      if (s.id !== socket.id) {
        s.emit("onDraw", { x: data.x, y: data.y });
      }
    });
  });

  socket.on("down", (data) => {
    connections.forEach((con) => {
      if (con.id !== socket.id) {
        con.emit("onDown", { x: data.x, y: data.y });
      }
    });
  });

  socket.on("disconnect", (reason) => {
    connections = connections.filter((s) => s.id !== socket.id);
    console.log(`Disconnected: ${connections.length} sockets connected`);
  });
});

app.use(express.static("public"));

httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
