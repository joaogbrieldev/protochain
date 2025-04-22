import BlockInfo from "../blockinfo";
import Validation from "../lib/validation";
import Block from "./block";

export default class BlockChain {
  blocks: Block[];
  nextIndex: number = 0;

  constructor() {
    this.blocks = [
      new Block({
        index: 0,
        previousHash: "",
        hash: "abc",
        data: "Genesis Block",
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
      data: new Date().toString(),
      difficulty: 0,
      previousHash: this.getLastBlock().hash,
      index: 1,
      feePerTx: this.getFeePerTx(),
      maxDifficulty: 62,
    } as BlockInfo;
  }
}
