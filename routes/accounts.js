import express, { response } from "express";
import { promises as fs, read } from "fs";

const { readFile, writeFile } = fs;

const router = express.Router();

// metodo Create 'C' do crud = post
router.post("/", async (require, response, next) => {
  try {
    let account = require.body;
    const data = JSON.parse(await readFile(global.fileName));

    account = { id: data.nextId++, ...account };
    data.accounts.push(account);

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    response.send(account);
    global.logger.info(`POST /account - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
});

// metodo Read 'R' do crud = get
router.get("/", async (require, response, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    delete data.nextId;

    response.send(data);
    global.logger.info(`GET /account`);
  } catch (err) {
    next(err);
  }
});

// metodo Read 'R' por id do crud = get
router.get("/:id", async (require, response, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    const account = data.accounts.find(
      (account) => account.id === parseInt(require.params.id)
    );

    response.send(account);
    global.logger.info(`GET /account/:id`);
  } catch (err) {
    next(err);
  }
});

//metodo Delete 'D' por id do crud = delete
router.delete("/:id", async (require, response, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileName));
    data.accounts = data.accounts.filter(
      (account) => account.id !== parseInt(require.params.id)
    );
    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    response.end();
    global.logger.info(`DELETE /account/:id - ${require.params.id}`);
  } catch (err) {
    next(err);
  }
});

//metodo Update 'U' do crud = put atualizacao integral
router.put("/", async (require, response, next) => {
  try {
    const account = require.body;
    const data = JSON.parse(await readFile(global.fileName));

    const index = data.accounts.findIndex((a) => a.id === account.id);
    data.accounts[index] = account;

    await writeFile(global.fileName, JSON.stringify(data));

    response.send(account);
    global.logger.info(`PUT /account - ${JSON.stringify(account)}`);
  } catch (err) {
    next(err);
  }
});

//metodo Update 'U' do crud = patch atualizacao parcial
router.patch("/updateBalance", async (require, response, next) => {
  try {
    const account = require.body;
    const data = JSON.parse(await readFile(global.fileName));

    const index = data.accounts.findIndex((a) => a.id === account.id);
    data.accounts[index].balance = account.balance;

    await writeFile(global.fileName, JSON.stringify(data));

    response.send(data.accounts[index]);
    global.logger.info(
      `PATCH /account/updateBalance - ${JSON.stringify(account)}`
    );
  } catch (err) {
    next(err);
  }
});

router.use((err, require, response, next) => {
  global.logger.error(`${require.method} ${require.baseUrl} - ${err.message}`);
  response.status(400).send({ error: err.message });
});

export default router;
