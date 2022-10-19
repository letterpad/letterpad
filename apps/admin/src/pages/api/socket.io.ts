import { Server } from "socket.io";

const socketMap = {};

const ioHandler = (_req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, { path: "/admin/api/socket.io" });
    io.on("connection", (socket) => {
      socket.broadcast.emit("a user connected");

      socketMap[socket.id] = socket;

      socket.on("REVIEW", async function ({ m, index }, ackCallback) {
        try {
          const correction = await api(m);
          socket.emit("REVIEW", { correction, index });
          ackCallback(index);
        } catch (e: any) {
          ackCallback(null);
        }
      });

      socket.on("disconnect", () => {});
    });

    res.socket.server.io = io;
  } else {
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

async function api(text: string) {
  const response = await fetch(process.env.LANGUAGE_TOOL_URL, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: `language=en-US&text=${text}`,
  }).then((res) => res.json());
  return response;
}

export default ioHandler;
