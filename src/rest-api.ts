import { Router } from "express";
import { db } from "./app";

const router = Router();

router.get("/find", async (req, res) => {
  const { collectionName, filter, options } = req.query as any;
  const result = await db.find(collectionName, filter, options);
  res.send(result);
});

router.get("/findOne", async (req, res) => {
  const { collectionName, filter, options } = req.query as any;
  const result = await db.findOne(collectionName, filter, options);
  res.send(result);
});

router.get("/findOneWithId", async (req, res) => {
  const { collectionName, docId } = req.query as any;
  const result = await db.findOneWithId(collectionName, docId);
  res.send(result);
});

export default router;
