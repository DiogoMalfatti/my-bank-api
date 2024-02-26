import express from "express";
import { promises as fs, read } from "fs";

const { readFile, writeFile } = fs;

const router = express.Router();

router.post("/", async (require, response) => {
  try {
    let account = require.body;
    let data = JSON.parse(await readFile("accounts.json"));

    account = { id: data.nextId++, ...account };
    data.accounts.push(account);

    await writeFile("accounts.json", JSON.stringify(data, null, 2));

    response.send(account);
  } catch (err) {
    response.status(400).send({ error: err.message });
  }
});

export default router;
