import dotenv from "dotenv";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import MongoDBInterface from "./mongodb-interface";
import { createAPI } from "./socket-io-api";
import RestAPIRoutes from "./rest-api";
import TypesParser from "./query-types-parser";

dotenv.config();

const app = express();

const httpServer = createServer(app);

createAPI(httpServer);

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

app.use(TypesParser());

// Connect to MongoDB
const URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/?authSource=admin`;
export const db = new MongoDBInterface(URI);

(async () => {
  await db.connect("raspidb");
  httpServer.listen(3001, () => {
    console.log("Server listening on port 3001! App url: http://localhost:3001");
  });
})();

app.get("/", (req, res) => {
  res.send({
    ok: true,
    message: "The application is currently under active development!",
  });
});

app.use("/db", RestAPIRoutes);
