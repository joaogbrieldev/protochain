import Block from "../src/block";
import BlockChain from "../src/blockchain";

describe("Blockchain tests", () => {
  test('Should has genesis blocks', () => {
    const blockchain = new BlockChain();
    expect(blockchain.blocks.length).toEqual(1)
  })

  test('Should has genesis blocks', () => {
    const blockchain = new BlockChain();
    expect(blockchain.isValid()).toEqual(true)
  })

  test('Should has genesis blocks', () => {
    const blockchain = new BlockChain();
    const result = blockchain.addBlock(new Block(1, blockchain.blocks[0].hash, "Block 2"))
    expect(result).toEqual(true)
  })
})