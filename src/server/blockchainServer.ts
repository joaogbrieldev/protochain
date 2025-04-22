import dotenv from "dotenv";
import express, { Request } from "express";
import morgan from "morgan";
import Block from "../block";
import BlockChain from "../blockchain";
dotenv.config();

const PORT: number = parseInt(`${process.env.PORT}`) || 3000;

const app = express();

if (process.argv.includes("--run")) {
  app.use(morgan("tiny"));
}

app.use(express.json());

const blockchain = new BlockChain();

app.get("/status", (req: Request, res: any) => {
  res.json({
    numberOfBlocks: blockchain.blocks.length,
    isValid: blockchain.isValid(),
    lastBlock: blockchain.getLastBlock(),
  });
});

app.get("/blocks/next", (req: Request, res: any) => {
  const nextBlock = blockchain.getNextBlock();

  if (!nextBlock) return res.sendStatus(404);
  else return res.json(nextBlock);
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

if (process.argv.includes("--run"))
  app.listen(PORT, () => {
    console.log("a");
  });

export { app };
