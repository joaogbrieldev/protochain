import Block from "../src/lib/block";
import BlockChain from "../src/lib/blockchain";
import Transaction from "../src/lib/transaction";

jest.mock("../src/lib/block");
jest.mock("../src/lib/transaction");

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
        transactions: [
          new Transaction({
            data: "Block 2",
          } as Transaction),
        ],
      } as Block)
    );
    expect(blockchain.isValid().sucess).toEqual(true);
  });

  test("Should NOT be valid", () => {
    const blockchain = new BlockChain();
    const tx = new Transaction({
      data: "tx1",
    } as Transaction);
    blockchain.mempool.push(tx);
    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [tx],
      } as Block)
    );
    blockchain.blocks[1].index = -1;
    expect(blockchain.isValid().sucess).toEqual(false);
  });

  test("Should add transaction", () => {
    const blockchain = new BlockChain();
    const tx = new Transaction({
      data: "tx1",
      hash: "test",
    } as Transaction);
    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toEqual(true);
  });

  test("Should NOT add transaction", () => {
    const blockchain = new BlockChain();
    const tx = new Transaction({
      data: "",
    } as Transaction);
    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toEqual(false);
  });

  test("Should NOT add transaction (invalid tx)", () => {
    const blockchain = new BlockChain();
    const tx = new Transaction({
      data: "",
    } as Transaction);
    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toEqual(false);
  });

  test("Should NOT add transaction (invalid duplicated in blockchain)", () => {
    const blockchain = new BlockChain();
    const tx = new Transaction({
      data: "abc",
      hash: "xyz",
    } as Transaction);
    blockchain.blocks.push(
      new Block({
        transactions: [tx],
      } as Block)
    );
    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toEqual(false);
  });

  test("Should NOT add transaction (invalid duplicated mempool)", () => {
    const blockchain = new BlockChain();
    const tx = new Transaction({
      data: "abc",
      hash: "xyz",
    } as Transaction);
    blockchain.mempool.push(tx);
    const validation = blockchain.addTransaction(tx);
    expect(validation.sucess).toEqual(false);
  });

  test("Should get transaction (blockchain)", () => {
    const blockchain = new BlockChain();
    const tx = new Transaction({
      data: "tx1",
      hash: "xyz",
    } as Transaction);
    blockchain.blocks.push(
      new Block({
        transactions: [tx],
      } as Block)
    );
    const result = blockchain.getTransaction("xyz");
    expect(result.blockIndex).toEqual(1);
  });

  test("Should get transaction (mempool)", () => {
    const blockchain = new BlockChain();
    const tx = new Transaction({
      data: "tx1",
      hash: "abc",
    } as Transaction);
    blockchain.mempool.push(tx);
    const result = blockchain.getTransaction("abc");
    expect(result.mempoolIndex).toEqual(0);
  });

  test("Should not get transaction", () => {
    const blockchain = new BlockChain();
    const result = blockchain.getTransaction("xyz");
    expect(result.blockIndex).toEqual(-1);
    expect(result.mempoolIndex).toEqual(-1);
  });

  test("Should add blocks", () => {
    const blockchain = new BlockChain();
    const tx = new Transaction({
      data: "tx1",
    } as Transaction);
    blockchain.mempool.push(tx);
    const result = blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [tx],
      } as Block)
    );
    expect(result.sucess).toEqual(true);
  });

  test("Should not add blocks", () => {
    const blockchain = new BlockChain();
    const block = new Block({
      index: -1,
      previousHash: blockchain.blocks[0].hash,
      transactions: [
        new Transaction({
          data: "Block 2",
        } as Transaction),
      ],
    } as Block);
    const result = blockchain.addBlock(block);
    expect(result.sucess).toEqual(false);
  });

  test("Should NOT add blocks", () => {
    const blockchain = new BlockChain();
    const tx = new Transaction({
      data: "tx1",
    } as Transaction);
    blockchain.mempool.push(tx);
    const result = blockchain.addBlock(
      new Block({
        index: -1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [tx],
      } as Block)
    );
    expect(result.sucess).toEqual(false);
  });

  test("Should NOT add blocks", () => {
    const blockchain = new BlockChain();
    const tx = new Transaction({
      data: "tx1",
    } as Transaction);
    blockchain.mempool.push(tx);
    blockchain.mempool.push(tx);
    const result = blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [tx],
      } as Block)
    );
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
    blockchain.mempool.push(new Transaction());
    const info = blockchain.getNextBlock();
    expect(info ? info.index : 0).toEqual(1);
  });

  test("Should NOT get next block info", () => {
    const blockchain = new BlockChain();
    const info = blockchain.getNextBlock();
    expect(info).toEqual(null);
  });
});
