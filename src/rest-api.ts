import { Router } from "express";
import { db } from "./app";

const router = Router();

router.get("/find", async (req, res) => {
  const { collectionName, filter, options } = req.query as {
    collectionName: string;
    filter?: object;
    options?: object;
  };
  console.log(collectionName, filter, options);
  console.log(typeof collectionName, typeof filter, typeof options);
  const result = await db.find(collectionName, filter, options);
  res.send(result);
});

export default router;
