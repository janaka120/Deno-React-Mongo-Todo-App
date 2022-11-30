import {
    MongoClient,
    Database,
    ObjectId
  } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { mongoDbUrl } from "../utils/constant.ts";

let db: Database;


interface TodoSchema {
  _id: ObjectId;
  username: string;
  password: string;
}

export async function connect() {
  const client = new MongoClient();
  try {
    await client.connect(mongoDbUrl);
    console.log("Database successfully connected");
  } catch (err) {
    console.log("db err >>>", err);
  }

  db = client.database("todos-app");
}

export function getDb() {
  return db;
}

export function getCollection() {
  return db.collection<TodoSchema>("todos");
}

// export todos;