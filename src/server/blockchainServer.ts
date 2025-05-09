import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import Block from "../lib/block";
import BlockChain from "../lib/blockchain";
import Transaction from "../lib/transaction";
dotenv.config();

/* c8 ignore next */
const PORT: number = parseInt(`${process.env.BLOCKCHAIN_PORT || 3000}`);

const app = express();

/* c8 ignore start */
if (process.argv.includes("--run")) app.use(morgan("tiny"));
/* c8 ignore stop */

app.use(express.json());

const blockchain = new BlockChain();

app.get("/status", (req: Request, res: any) => {
  res.json({
    numberOfBlocks: blockchain.blocks.length,
    isValid: blockchain.isValid(),
    lastBlock: blockchain.getLastBlock(),
  });
});

app.get("/blocks/next", (req: Request, res: Response, next: NextFunction) => {
  res.json(blockchain.getNextBlock());
});

app.get("/blocks/:indexOrHash", (req: Request, res: any) => {
  let block;
  if (/^[0-9]+$/.test(req.params.indexOrHash))
    block = blockchain.blocks[parseInt(req.params.indexOrHash)];
  else block = blockchain.getBlock(req.params.indexOrHash);

  if (!block) return res.sendStatus(404);
  else return res.json(block);
});

app.post("/blocks", (req: Request, res: any) => {
  if (req.body.hash === undefined) return res.sendStatus(422);
  const block = new Block(req.body as Block);
  const validation = blockchain.addBlock(block);
  if (validation.sucess) res.status(201).json(block);
  else res.status(400).json(validation);
});

app.post("/transactions", (req: Request, res: any) => {
  const tx = new Transaction(req.body as Transaction);
  const validation = blockchain.addTransaction(tx);
  if (validation.sucess) res.status(201).json(tx);
  else res.status(400).json(validation);
});

app.get("/transactions", (req: Request, res: any) => {
  return res.json({
    next: blockchain.mempool.slice(0, BlockChain.TX_PER_BLOCK),
    total: blockchain.mempool.length,
  });
});

app.get("/transactions/:hash", (req: Request, res: any) => {
  if (req.params.hash) {
    res.json(blockchain.getTransaction(req.params.hash));
  }
  return res.json(blockchain.mempool);
});

/* c8 ignore start */
if (process.argv.includes("--run"))
  app.listen(PORT, () =>
    console.log(`Blockchain server is running at ${PORT}.`)
  );
/* c8 ignore stop */

export { app };
