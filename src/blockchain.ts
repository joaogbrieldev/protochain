import Block from "./block";
import BlockInfo from "./blockinfo";
import Validation from "./lib/validation";

export default class BlockChain {
  blocks: Block[];
  nextIndex: number = 0;
  static DIFFICULTY_FACTOR = 5;
  static MAX_DIFFICULTY = 62;

  constructor() {
    this.blocks = [
      new Block({
        index: this.nextIndex,
        previousHash: "",
        data: "Genesis Block",
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

  addBlock(block: Block): Validation {
    const lastBlock = this.getLastBlock();
    const validation = block.isValid(
      lastBlock.hash,
      lastBlock.index,
      this.getDifficulty()
    );
    if (!validation.sucess)
      return new Validation(false, `Invalid block: ${validation.message}`);
    this.blocks.push(block);
    this.nextIndex++;
    return new Validation();
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

  getNextBlock(): BlockInfo {
    const data = new Date().toString();
    const difficulty = this.getDifficulty();
    const previousHash = this.getLastBlock().hash;
    const index = this.blocks.length;
    const feePerTx = this.getFeePerTx();
    const maxDifficulty = BlockChain.MAX_DIFFICULTY;
    return {
      data,
      difficulty,
      previousHash,
      index,
      feePerTx,
      maxDifficulty,
    } as BlockInfo;
  }
}
