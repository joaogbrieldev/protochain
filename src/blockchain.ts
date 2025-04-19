import Block from "./block";
import Validation from "./lib/validation";

export default class BlockChain {
  blocks: Block[];
  nextIndex: number = 0;

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

  addBlock(block: Block): Validation {
    const lastBlock = this.getLastBlock();
    const validation = block.isValid(lastBlock.hash, lastBlock.index);
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
        previusBlock.index
      );
      if (!validation.sucess)
        return new Validation(
          false,
          `Invalid block ${currentBlock.index}: ${validation.message}`
        );
    }
    return new Validation();
  }
}
