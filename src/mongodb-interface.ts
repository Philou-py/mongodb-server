import { MongoClient, Db, Filter, FindOptions, ObjectId, Document, Collection } from "mongodb";

interface MongoError {
  status: "NOT_FOUND" | "MONGO_SERVER_ERROR";
  message: string;
}

export default class MongoDBInterface {
  private client: MongoClient;
  private db!: Db;
  private collections: Record<string, Collection<Document>>;

  constructor(connectionURI: string) {
    this.client = new MongoClient(connectionURI);
    this.collections = {};
  }

  async connect(dbName: string) {
    try {
      await this.client.connect();
      this.db = this.client.db(dbName);
    } catch (error) {
      console.log(error);
      await this.client.close();
    }
  }

  private getCollection(collectionName: string) {
    if (!this.collections[collectionName]) {
      this.collections[collectionName] = this.db.collection(collectionName);
    }
    return this.collections[collectionName];
  }

  private withTimestamps(doc: Document, type: "created" | "updated") {
    const now = new Date();
    if (type === "created") {
      return { ...doc, createdAt: now, updatedAt: now };
    } else {
      return { ...doc, updatedAt: now };
    }
  }

  private capitalise(str: string) {
    return str[0].toUpperCase() + str.slice(1);
  }

  async find(collectionName: string, filter?: Filter<Document>, options?: FindOptions) {
    let data = null;
    let error: MongoError | undefined;
    try {
      const collection = this.getCollection(collectionName);
      const cursor = collection.find(filter ? filter : {}, options);
      data = await cursor.toArray();
      if (data.length === 0) {
        error = {
          status: "NOT_FOUND",
          message: "No documents matched the query!",
        };
      }
    } catch (err: any) {
      error = { status: "MONGO_SERVER_ERROR", message: this.capitalise(err.message) };
    } finally {
      return { data, error };
    }
  }

  async findOne(collectionName: string, filter: Filter<Document>, options?: FindOptions) {
    let doc = null;
    let error: MongoError | undefined;
    try {
      const collection = this.getCollection(collectionName);
      doc = await collection.findOne(filter, options);
      if (!doc) {
        error = { status: "NOT_FOUND", message: "Document not found!" };
      }
    } catch (err: any) {
      error = { status: "MONGO_SERVER_ERROR", message: err.message };
    } finally {
      return { data: doc, error };
    }
  }

  async findOneWithId(collection: string, docId: string) {
    return await this.findOne(collection, { _id: docId });
  }

  async insertOne(collectionName: string, doc: Document) {
    let newDoc = null;
    let error: MongoError | undefined;
    try {
      const collection = this.getCollection(collectionName);
      const docWithTimestamps = this.withTimestamps(doc, "created");
      const { insertedId } = await collection.insertOne(docWithTimestamps);
      newDoc = { ...docWithTimestamps, _id: insertedId };
    } catch (err: any) {
      error = { status: "MONGO_SERVER_ERROR", message: err.message };
    } finally {
      return { data: newDoc, error };
    }
  }

  async updateOne(collectionName: string, filter: Filter<Document>, updateDoc: Document) {
    let updatedDoc = null;
    let error: MongoError | undefined;

    try {
      const collection = this.getCollection(collectionName);
      const { value } = await collection.findOneAndUpdate(
        filter,
        {
          $set: this.withTimestamps(updateDoc, "updated"),
        },
        { returnDocument: "after" }
      );
      updatedDoc = value;
      if (!updatedDoc) {
        error = { status: "NOT_FOUND", message: "Document not found!" };
      }
    } catch (err: any) {
      error = { status: "MONGO_SERVER_ERROR", message: err.message };
    } finally {
      return { data: updatedDoc, error };
    }
  }

  async updateOneWithId(collection: string, docId: string, updateDoc: Document) {
    return await this.updateOne(collection, { _id: docId }, updateDoc);
  }

  async replaceOne(collectionName: string, filter: Filter<Document>, replaceDoc: Document) {
    let updatedDoc = null;
    let error: MongoError | undefined;
    try {
      const collection = this.getCollection(collectionName);
      const { value } = await collection.findOneAndReplace(
        filter,
        this.withTimestamps(replaceDoc, "created"),
        { returnDocument: "after" }
      );
      updatedDoc = value;
      if (!updatedDoc) {
        error = { status: "NOT_FOUND", message: "Document not found!" };
      }
    } catch (err: any) {
      error = { status: "MONGO_SERVER_ERROR", message: err.message };
    } finally {
      return { data: updatedDoc, error };
    }
  }

  async replaceOneWithId(collection: string, docId: string, updateDoc: Document) {
    return await this.replaceOne(collection, { _id: docId }, updateDoc);
  }

  async deleteOne(collectionName: string, filter: Filter<Document>) {
    let deletedDoc = null;
    let error: MongoError | undefined;
    try {
      const collection = this.getCollection(collectionName);
      const { value } = await collection.findOneAndDelete(filter);
      deletedDoc = value;
      if (!deletedDoc) {
        error = { status: "NOT_FOUND", message: "Document not found!" };
      }
    } catch (err: any) {
      error = { status: "MONGO_SERVER_ERROR", message: err.message };
    } finally {
      return { data: deletedDoc, error };
    }
  }

  async deleteOneWithId(collection: string, docId: string) {
    return await this.deleteOne(collection, { _id: docId });
  }
}

//   Tests
//   app.get("/test-find", async (req, res) => {
//     const users = await db.find(usersCollection, { email: { $regex: "pierre" } });
//     res.send(users);
//   });

//   app.get("/test-find-with-id", async (req, res) => {
//     const user = await db.findOneWithId(usersCollection, "612948f9f835e9be88db8127");
//     res.send(user);
//   });

//   app.get("/test-findall", async (req, res) => {
//     const users = await db.find(usersCollection);
//     res.send(users);
//   });

//   app.get("/test-insert", async (req, res) => {
//     const docToInsert = {
//       email: "philippe.schoenhenz@gmail.com",
//       password: "mysecretpassword",
//     };
//     const result = await db.insertOne(usersCollection, docToInsert);
//     res.send(result);
//   });

//   app.get("/test-update", async (req, res) => {
//     const update = {
//       email: "philippe.schoenhenz@gmail.com",
//       password: "mysecretpassword2",
//     };
//     const result = await db.updateOneWithId(usersCollection, "612948f9f835e9be88db8127", update);
//     res.send(result);
//   });

//   app.get("/test-delete-one", async (req, res) => {
//     const result = await db.deleteOneWithId(usersCollection, "6122516dd14aea7d1c61ac57");
//     res.send(result);
//   });

//   app.get("/test-replace", async (req, res) => {
//     const update = {
//       email: "philippe.schoenhenz@gmail.com",
//       password: "mysecretpassword2",
//     };
//     const result = await db.replaceOneWithId(usersCollection, "612948f9f835e9be88db8127", update);
//     res.send(result);
//   });
