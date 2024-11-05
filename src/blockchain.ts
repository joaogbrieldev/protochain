import Block from "./block"

export default class BlockChain {
  blocks: Block[]
  nextIndex: number = 0

  constructor(){
    this.blocks = [new Block(this.nextIndex, "", "Genesis Block")]
    this.nextIndex++
  };

  getLastBlock():Block {
    return this.blocks[this.blocks.length -1]
  };

  addBlock(block: Block): boolean {
    const lastBlock = this.getLastBlock()
    if (!block.isValid(lastBlock.hash, lastBlock.index)) return false
    this.blocks.push(block)
    this.nextIndex ++
    return true
  };

  isValid(): boolean {
    for (let i = this.blocks.length -1; i > 0; i--){
      const currentBlock = this.blocks[i];
      const previusBlock = this.blocks[i -1];
      const isValid = currentBlock.isValid(previusBlock.hash, previusBlock.index)
      if(!isValid) return false
    }
    return true
  }

}