import { Server } from "socket.io";

const socketMap = {};

const ioHandler = (_req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, { path: "/admin/api/socket.io" });
    io.on("connection", (socket) => {
      console.log("A user got connected");
      socket.broadcast.emit("a user connected");

      socketMap[socket.id] = socket;

      socket.on("WELCOME", () => {
        socket.emit("WELCOME", "Welcome to Socket world");
      });

      socket.on("REVIEW", async ({ m, index }) => {
        try {
          const correction = await api(m);
          socket.emit("REVIEW", { correction, index });
        } catch (e) {
          console.log(e);
        }
      });

      socket.on("disconnect", () => {
        console.log("client disconnected");
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("socket.io already running");
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

async function api(text: string) {
  const response = await fetch("http://localhost:8010/v2/check", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: `language=en-US&text=${text}`,
  }).then((res) => res.json());
  return response;
}

export default ioHandler;
