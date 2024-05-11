// import { createServer } from "node:http";
// import next from "next";
// import { Server } from "socket.io";

const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");
const { readFileSync } = require("fs");
const { PeerServer } = require("peer");
const { parse } = require("url");

const peerServer = PeerServer({ port: 9000, path: "/myapp" });

const dev = process.env.NODE_ENV !== "production";
const HOSTNAME = "localhost";
const PORT = process.env.port || 3000;

const httpsOptions = {
  key: readFileSync("./localhost-key.pem"),
  cert: readFileSync("./localhost.pem"),
};

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname: HOSTNAME, port: PORT });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  // const httpServer = createServer(httpsOptions, handler);
  // const httpServer = createServer(handler);

  const httpServer = createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handler(req, res, parsedUrl);
  })

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
      socket.broadcast.emit("callended");
    });

    socket.on("join-room", (roomId, userId) => {
      socket.join(roomId);

      console.log({ roomId, userId });

      io.to(roomId).emit("user-connected", userId);

      socket.on("disconnect", () => {
        socket.broadcast.to(roomId).emit("user-disconnected", userId);
      });
    });

  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(PORT, () => {
      console.log(`> Ready on https://${HOSTNAME}:${PORT}`);
    });
});
