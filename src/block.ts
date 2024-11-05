import sha256 from 'crypto-js/sha256';

export default class Block {
  index: number;
  hash: string;
  timestamp: number;
  data: string;
  previousHash: string

  constructor(index: number, previousHash: string, data: string){
    this.index = index;
    this.hash = this.getHash()
    this.timestamp = Date.now()
    this.previousHash = previousHash;
    this.data = data
  }

  getHash(): string{
    return sha256(this.index + this.data + this.timestamp + this.previousHash).toString()
  }

  isValid(previusHash: string, previusIndex:number):boolean{
    if(previusIndex !== this.index -1) return false;
    if(!this.hash) return false;
    if(!this.data) return false;
    if(this.timestamp < 1) return false;
    if(this.previousHash !== previusHash) return false;
    return true
  }
}

