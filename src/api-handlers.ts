import { Socket } from "socket.io";
import { Document, FindOptions, Filter } from "mongodb";
import { db } from "./app";
import { Callback } from "./events";

export async function insertOne(
  this: Socket,
  collectionName: string,
  doc: Document,
  callback: Callback
) {
  const result = await db.insertOne(collectionName, doc);
  callback(result);
  this.broadcast.emit(`${collectionName}:newChange`, { method: "insertOne", data: result.data });
}

export async function find(
  this: Socket,
  collectionName: string,
  filter: Filter<Document>,
  options: FindOptions,
  callback: Callback<object[]>
) {
  const result = await db.find(collectionName, filter, options);
  callback(result);
}

export async function findOne(
  this: Socket,
  collectionName: string,
  filter: Filter<Document>,
  options: FindOptions,
  callback: Callback
) {
  const result = await db.findOne(collectionName, filter, options);
  callback(result);
}

export async function findOneWithId(
  this: Socket,
  collectionName: string,
  docId: string,
  callback: Callback
) {
  const result = await db.findOneWithId(collectionName, docId);
  callback(result);
}

export async function updateOne(
  this: Socket,
  collectionName: string,
  filter: Filter<Document>,
  updateDoc: Document,
  callback: Callback
) {
  const result = await db.updateOne(collectionName, filter, updateDoc);
  callback(result);
  if (!result.error && result.data) {
    this.broadcast.emit(`${collectionName}:newChange`, {
      method: "updateOne",
      data: result.data,
    });
  }
}

export async function updateOneWithId(
  this: Socket,
  collectionName: string,
  docId: string,
  updateDoc: Document,
  callback: Callback
) {
  const result = await db.updateOneWithId(collectionName, docId, updateDoc);
  callback(result);
  if (!result.error && result.data) {
    this.broadcast.emit(`${collectionName}:newChange`, {
      method: "updateOne",
      data: result.data,
    });
  }
}

export async function replaceOne(
  this: Socket,
  collectionName: string,
  filter: Filter<Document>,
  replaceDoc: Document,
  callback: Callback
) {
  const result = await db.replaceOne(collectionName, filter, replaceDoc);
  callback(result);
  if (!result.error && result.data) {
    this.broadcast.emit(`${collectionName}:newChange`, {
      method: "replaceOne",
      data: result.data,
    });
  }
}

export async function replaceOneWithId(
  this: Socket,
  collectionName: string,
  docId: string,
  replaceDoc: Document,
  callback: Callback
) {
  const result = await db.replaceOneWithId(collectionName, docId, replaceDoc);
  callback(result);
  if (!result.error && result.data) {
    this.broadcast.emit(`${collectionName}:newChange`, {
      method: "replaceOne",
      data: result.data,
    });
  }
}

export async function deleteOne(
  this: Socket,
  collectionName: string,
  filter: Filter<Document>,
  callback: Callback
) {
  const result = await db.deleteOne(collectionName, filter);
  callback(result);
  if (!result.error && result.data) {
    this.broadcast.emit(`${collectionName}:newChange`, {
      method: "deleteOne",
      data: result.data,
    });
  }
}

export async function deleteOneWithId(
  this: Socket,
  collectionName: string,
  docId: string,
  callback: Callback
) {
  const result = await db.deleteOneWithId(collectionName, docId);
  callback(result);
  if (!result.error && result.data) {
    this.broadcast.emit(`${collectionName}:newChange`, {
      method: "deleteOne",
      data: result.data,
    });
  }
}
