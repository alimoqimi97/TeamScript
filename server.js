// import { createServer } from "node:http";
// import next from "next";
// import { Server } from "socket.io";

const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const HOSTNAME = "localhost";
const PORT = process.env.port || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname: HOSTNAME, port: PORT });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`user connected with id: ${socket.id}`)

    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
      socket.broadcast.emit("callended");
    });

    socket.on('join-room', (roomId, userId) => {
      console.log(`user ${userId} joined the room ${roomId}`);
      
      socket.join(roomId);

      socket.to(roomId).broadcast.emit('user-connected', userId);

      socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected',userId)
      })
    })

    // socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    //   io.to(userToCall).emit("calluser", { signal: signalData, from, name });
    // });

    // socket.on('answercall', (data) => {
    //   io.to(data.to).emit('callaccepted', data.signal)
    // })
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(PORT, () => {
      console.log(`> Ready on http://${HOSTNAME}:${PORT}`);
    });
});
