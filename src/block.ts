import sha256 from "crypto-js/sha256";
import BlockInfo from "./blockinfo";
import Validation from "./lib/validation";

export default class Block {
  index: number;
  hash: string;
  timestamp: number;
  previousHash: string;
  data: string;
  nonce: number;
  miner: string;

  constructor(block?: Block) {
    this.index = block?.index || 0;
    this.previousHash = block?.previousHash || "";
    this.data = block?.data || "";
    this.timestamp = block?.timestamp || Date.now();
    this.nonce = block?.nonce || 0;
    this.miner = block?.miner || "";
    this.hash = block?.hash || this.getHash();
  }

  getHash(): string {
    return sha256(
      this.index +
        this.data +
        this.timestamp +
        this.previousHash +
        this.nonce +
        this.miner
    ).toString();
  }

  mine(difficulty: number, miner: string) {
    this.miner = miner;
    const prefix = new Array(difficulty + 1).join("0");

    do {
      this.nonce++;
      this.hash = this.getHash();
    } while (!this.hash.startsWith(prefix));
  }

  isValid(
    previusHash: string,
    previusIndex: number,
    difficulty: number
  ): Validation {
    if (previusIndex !== this.index - 1)
      return new Validation(false, "Invalid Index");
    if (this.hash !== this.getHash())
      return new Validation(false, "Invalid hash");
    if (!this.data) return new Validation(false, "Invalid data");
    if (this.timestamp < 1) return new Validation(false, "Invalid timestamp");
    if (!this.nonce || !this.miner) return new Validation(false, "No mined");
    const prefix = new Array(difficulty + 1).join("0");
    if (this.previousHash !== previusHash || !this.hash.startsWith(prefix))
      return new Validation(false, "Invalid previusHash");
    return new Validation();
  }

  static fromBlockInfo(blockInfo: BlockInfo): Block {
    const block = new Block();
    block.index = blockInfo.index;
    block.previousHash = blockInfo.previousHash;
    block.data = blockInfo.data;
    return block;
  }
}
