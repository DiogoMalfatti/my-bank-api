import express from "express";
import { promises as fs, read } from "fs";

const { readFile, writeFile } = fs;

const router = express.Router();

// metodo Create 'C' do crud
router.post("/", async (require, response) => {
  try {
    let account = require.body;
    const data = JSON.parse(await readFile(global.fileName));

    account = { id: data.nextId++, ...account };
    data.accounts.push(account);

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    response.send(account);
  } catch (err) {
    response.status(400).send({ error: err.message });
  }
});

// metodo Read 'R' do crud
router.get("/", async (require, response) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    delete data.nextId;
    response.send(data);
  } catch (err) {
    response.status(400).send({ error: err.message });
  }
});

// metodo Read 'R' por id do crud
router.get("/:id", async (require, response) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    const account = data.accounts.find(
      (account) => account.id === parseInt(require.params.id)
    );
    response.send(account);
  } catch (err) {
    response.status(400).send({ error: err.message });
  }
});

export default router;
