import BlockInfo from "../blockInfo";
import Validation from "../validation";
import Block from "./block";
import Transaction, { TransactionType } from "./transaction";

export default class BlockChain {
  blocks: Block[];
  nextIndex: number = 0;

  constructor() {
    this.blocks = [
      new Block({
        index: 0,
        previousHash: "",
        hash: "abc",
        transactions: [
          new Transaction({
            data: "tx1",
            type: TransactionType.FEE,
          } as Transaction),
        ],
        timestamp: Date.now(),
      } as Block),
    ];
    this.nextIndex++;
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  getBlock(hash: string): Block | undefined {
    const block = this.blocks.find((b) => b.hash === hash);
    return block;
  }

  addBlock(block: Block): Validation {
    if (block.index < 0) return new Validation(false, "Invalid Mock block.");
    this.blocks.push(block);
    this.nextIndex++;
    return new Validation();
  }

  isValid(): Validation {
    return new Validation();
  }

  getFeePerTx(): number {
    return 1;
  }

  getNextBlock(): BlockInfo {
    return {
      transactions: [
        new Transaction({
          data: new Date().toString(),
        } as Transaction),
      ],
      difficulty: 0,
      previousHash: this.getLastBlock().hash,
      index: 1,
      feePerTx: this.getFeePerTx(),
      maxDifficulty: 62,
    } as BlockInfo;
  }
}
