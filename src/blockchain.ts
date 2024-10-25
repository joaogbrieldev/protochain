import Block from "./block";

export default class BlockChain {
  blocks: Block[]

  constructor(){
    this.blocks = [new Block(0, "", "Genesis Block")]
  }
}