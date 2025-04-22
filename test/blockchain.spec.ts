import Block from "../src/block";
import BlockChain from "../src/blockchain";

jest.mock("../src/block");

describe("Blockchain tests", () => {
  test("Should has genesis blocks", () => {
    const blockchain = new BlockChain();
    expect(blockchain.blocks.length).toEqual(1);
  });

  test("Should be valid (genesis)", () => {
    const blockchain = new BlockChain();
    expect(blockchain.isValid().sucess).toEqual(true);
  });

  test("Should be valid (two blocks)", () => {
    const blockchain = new BlockChain();
    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        data: "Block 2",
      } as Block)
    );
    expect(blockchain.isValid().sucess).toEqual(true);
  });

  test("Should NOT be valid", () => {
    const blockchain = new BlockChain();
    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        data: "Block 2",
      } as Block)
    );
    blockchain.blocks[1].index = -1;
    expect(blockchain.isValid().sucess).toEqual(false);
  });

  test("Should add blocks", () => {
    const blockchain = new BlockChain();
    const result = blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        data: "Block 2",
      } as Block)
    );
    expect(result.sucess).toEqual(true);
  });

  test("Should not add blocks", () => {
    const blockchain = new BlockChain();
    const block = new Block({
      index: -1,
      previousHash: blockchain.blocks[0].hash,
      data: "Block 2",
    } as Block);
    const result = blockchain.addBlock(block);
    expect(result.sucess).toEqual(false);
  });

  test("Should find block", () => {
    const blockchain = new BlockChain();
    const result = blockchain.getBlock(blockchain.blocks[0].hash);
    expect(result).toEqual(blockchain.blocks[0]);
  });
  test("Should return undefined when not find block", () => {
    const blockchain = new BlockChain();
    const result = blockchain.getBlock("-1");
    expect(result).toEqual(undefined);
  });
  test("Should get next block info", () => {
    const blockchain = new BlockChain();
    const info = blockchain.getNextBlock();
    expect(info.index).toEqual(1);
  });
});
