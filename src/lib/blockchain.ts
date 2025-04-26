import Block from "./block";
import BlockInfo from "./blockInfo";
import Transaction, { TransactionType } from "./transaction";
import TransactionSearch from "./transactionSearch";
import Validation from "./validation";

export default class BlockChain {
  blocks: Block[];
  nextIndex: number = 0;
  mempool: Transaction[];
  static DIFFICULTY_FACTOR = 5;
  static TX_PER_BLOCK = 2;
  static MAX_DIFFICULTY = 62;

  constructor() {
    this.mempool = [];
    this.blocks = [
      new Block({
        index: this.nextIndex,
        previousHash: "",
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            data: new Date().toString(),
          } as Transaction),
        ],
      } as Block),
    ];
    this.nextIndex++;
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  getBlock(hash: string): Block | undefined {
    return this.blocks.find((b) => b.hash === hash);
  }

  getDifficulty(): number {
    return Math.ceil(this.blocks.length / BlockChain.DIFFICULTY_FACTOR);
  }

  addTransaction(transaction: Transaction): Validation {
    const validation = transaction.isValid();
    if (!validation.sucess)
      return new Validation(false, "Invalid tx: " + validation.message);
    if (
      this.blocks.some((b) =>
        b.transactions.some((tx) => tx.hash === transaction.hash)
      )
    )
      return new Validation(false, "Duplicated tx: " + validation.message);

    if (this.mempool.some((tx) => tx.hash === transaction.hash))
      return new Validation(false, "Duplicated tx: " + validation.message);

    this.mempool.push(transaction);
    return new Validation(true, transaction.hash);
  }

  addBlock(block: Block): Validation {
    const nextBlock = this.getNextBlock();
    if (!nextBlock)
      return new Validation(false, `There is no next block info.`);

    const validation = block.isValid(
      nextBlock.previousHash,
      nextBlock.index - 1,
      nextBlock.difficulty
    );
    if (!validation.sucess)
      return new Validation(false, `Invalid block: ${validation.message}`);

    const txs = block.transactions
      .filter((tx) => tx.type !== TransactionType.FEE)
      .map((tx) => tx.hash);
    const newMempool = this.mempool.filter((tx) => !txs.includes(tx.hash));
    if (newMempool.length + txs.length !== this.mempool.length)
      return new Validation(false, `Invalid tx in block: mempool`);

    this.mempool = newMempool;

    this.blocks.push(block);
    this.nextIndex++;

    return new Validation(true, block.hash);
  }

  getTransaction(hash: string): TransactionSearch {
    const mempoolIndex = this.mempool.findIndex((tx) => tx.hash === hash);
    if (mempoolIndex !== -1)
      return {
        mempoolIndex,
        transaction: this.mempool[mempoolIndex],
      } as TransactionSearch;
    const blockIndex = this.blocks.findIndex((b) =>
      b.transactions.some((tx) => tx.hash === hash)
    );
    if (blockIndex !== -1)
      return {
        mempoolIndex,
        transaction: this.mempool[blockIndex],
      } as TransactionSearch;
    return {
      blockIndex: -1,
      mempoolIndex: -1,
    } as TransactionSearch;
  }

  isValid(): Validation {
    for (let i = this.blocks.length - 1; i > 0; i--) {
      const currentBlock = this.blocks[i];
      const previusBlock = this.blocks[i - 1];
      const validation = currentBlock.isValid(
        previusBlock.hash,
        previusBlock.index,
        this.getDifficulty()
      );
      if (!validation.sucess)
        return new Validation(
          false,
          `Invalid block ${currentBlock.index}: ${validation.message}`
        );
    }
    return new Validation();
  }

  getFeePerTx(): number {
    return 1;
  }

  getNextBlock(): BlockInfo | null {
    if (!this.mempool || !this.mempool.length) return null;

    const transactions = this.mempool.slice(0, BlockChain.TX_PER_BLOCK);
    const difficulty = this.getDifficulty();
    const previousHash = this.getLastBlock().hash;
    const index = this.blocks.length;
    const feePerTx = this.getFeePerTx();
    const maxDifficulty = BlockChain.MAX_DIFFICULTY;
    return {
      transactions,
      difficulty,
      previousHash,
      index,
      feePerTx,
      maxDifficulty,
    } as BlockInfo;
  }
}
