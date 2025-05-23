import Validation from "../validation";

export enum TransactionType {
  REGULAR = 1,
  FEE = 2,
}

export default class Transaction {
  type: TransactionType;
  timestamp: number;
  hash: string;
  data: string;

  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR;
    this.timestamp = tx?.timestamp || Date.now();
    this.data = tx?.data || "";
    this.hash = tx?.hash || this.getHash();
  }

  getHash(): string {
    return "abc";
  }
  isValid(): Validation {
    if (!this.data) return new Validation(false, "Invalid data");
    return new Validation();
  }
}
