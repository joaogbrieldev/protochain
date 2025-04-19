import Validation from "../lib/validation";

export default class Block {
  index: number;
  hash: string;
  timestamp: number;
  previousHash: string;
  data: string;

  constructor(block?: Block) {
    this.index = block?.index || 0;
    this.previousHash = block?.previousHash || "";
    this.data = block?.data || "";
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
