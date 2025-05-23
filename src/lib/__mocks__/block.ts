import Validation from "../validation";
import Transaction from "./transaction";

export default class Block {
  index: number;
  hash: string;
  timestamp: number;
  previousHash: string;
  transactions: Transaction[];

  constructor(block?: Block) {
    this.index = block?.index || 0;
    this.previousHash = block?.previousHash || "";
    this.transactions = block?.transactions || [];
    this.timestamp = block?.timestamp || Date.now();
    this.hash = block?.hash || this.getHash();
  }

  getHash(): string {
    return this.hash || "abc";
  }

  isValid(previusHash: string, previusIndex: number): Validation {
    if (!previusHash || previusIndex < 0 || this.index < 0)
      return new Validation(false, "Invalid mock block.");
    return new Validation();
  }
}
