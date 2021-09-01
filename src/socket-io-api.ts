import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { ClientEvents, ServerEvents } from "./events";
import * as handlers from "./api-handlers";

export function createAPI(httpServer: HttpServer) {
  const io = new Server<ClientEvents, ServerEvents>(httpServer, {
    cors: {
      origin: [/^https:\/\/.*toccatech.com$/, /^(http|https):\/\/localhost:[0-9]{1,6}$/],
    },
    serveClient: false,
  });

  io.on("connection", (socket) => {
    console.log(`New connection (socket id: ${socket.id})`);

    socket.on("disconnect", () => {
      console.log("Socket disconnected!");
    });

    socket.on("collection:insertOne", handlers.insertOne);
    socket.on("collection:find", handlers.find);
    socket.on("collection:findOne", handlers.findOne);
    socket.on("collection:findOneWithId", handlers.findOneWithId);
    socket.on("collection:updateOne", handlers.updateOne);
    socket.on("collection:updateOneWithId", handlers.updateOneWithId);
    socket.on("collection:replaceOne", handlers.replaceOne);
    socket.on("collection:replaceOneWithId", handlers.replaceOneWithId);
    socket.on("collection:deleteOne", handlers.deleteOne);
    socket.on("collection:deleteOneWithId", handlers.deleteOneWithId);
  });
}
