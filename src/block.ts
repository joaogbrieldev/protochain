import sha256 from "crypto-js/sha256";
import Validation from "./lib/validation";

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
    return sha256(
      this.index + this.data + this.timestamp + this.previousHash
    ).toString();
  }

  isValid(previusHash: string, previusIndex: number): Validation {
    if (previusIndex !== this.index - 1)
      return new Validation(false, "Invalid Index");
    if (this.hash !== this.getHash())
      return new Validation(false, "Invalid hash");
    if (!this.data) return new Validation(false, "Invalid data");
    if (this.timestamp < 1) return new Validation(false, "Invalid timestamp");
    if (this.previousHash !== previusHash)
      return new Validation(false, "Invalid previusHash");
    return new Validation();
  }
}
