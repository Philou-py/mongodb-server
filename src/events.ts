export interface MongoError {
  status: "NOT_FOUND";
  message: string;
}

export type Callback<T = object | null> = (payload: { data: T; error?: MongoError }) => void;

export interface ClientEvents {
  "collection:insertOne": (collectionName: string, doc: object, callback: Callback) => void;

  "collection:find": (
    collectionName: string,
    filter: object,
    options: object,
    callback: Callback<object[]>
  ) => void;

  "collection:findOne": (
    collectionName: string,
    filter: object,
    options: object,
    callback: Callback
  ) => void;

  "collection:findOneWithId": (collectionName: string, docId: string, callback: Callback) => void;

  "collection:updateOne": (
    collectionName: string,
    filter: object,
    updateDoc: object,
    callback: Callback
  ) => void;

  "collection:updateOneWithId": (
    collectionName: string,
    docId: string,
    updateDoc: object,
    callback: Callback
  ) => void;

  "collection:replaceOne": (
    collectionName: string,
    filter: object,
    replaceDoc: object,
    callback: Callback
  ) => void;

  "collection:replaceOneWithId": (
    collectionName: string,
    docId: string,
    replaceDoc: object,
    callback: Callback
  ) => void;

  "collection:deleteOne": (collectionName: string, filter: object, callback: Callback) => void;

  "collection:deleteOneWithId": (collectionName: string, docId: string, callback: Callback) => void;
}

export interface ServerEvents {
  [newChange: string]: (payload: { method: string; data: object }) => void;
}
