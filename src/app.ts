import dotenv from "dotenv";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

dotenv.config();

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [/^https:\/\/.*toccatech.com$/, /^(http|https):\/\/localhost:[0-9]{1,6}$/],
  }
});

io.on("connection", (socket) => {
  console.log("New connection");
});

// Parse JSON request body into req.body object
app.use(express.json());

// Parse cookies sent in the request
app.use(cookieParser());

// CORS library initialisation allowing all subdomains from https://toccatech.com and all localhost servers
app.use(
  cors({
    origin: [/^https:\/\/.*toccatech.com$/, /^(http|https):\/\/localhost:[0-9]{1,6}$/],
  })
);

// Helmet initialisation with all the defaults
app.use(helmet());

httpServer.listen(3000, () => {
  console.log("Server listening on port 3000! App url: http://localhost:3000");
});

app.get("/", (req, res) => {
  res.send({
    ok: true,
    message: "The application is currently under active development!",
  });
});
