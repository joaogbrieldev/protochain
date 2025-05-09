import Block from "../src/lib/block";
import Transaction, { TransactionType } from "../src/lib/transaction";
jest.mock("../src/lib/transaction");
describe("Block tests", () => {
  const exempleDifficulty = 0;
  const exampleMiner = "joao";
  let genesis: Block;
  beforeAll(() => {
    genesis = new Block({
      transactions: [
        new Transaction({
          data: "Genesis block",
        } as Transaction),
      ],
    } as Block);
  });
  test("Should be valid", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          data: "Block 2",
        } as Transaction),
      ],
    } as Block);
    block.mine(exempleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);
    expect(valid.sucess).toBeTruthy();
  });

  test("Should NOT be valid (previusHash)", () => {
    const block = new Block({
      index: 1,
      previousHash: "abc",
      transactions: [
        new Transaction({
          data: "Block 2",
        } as Transaction),
      ],
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("Should NOT be valid (index)", () => {
    const block = new Block({
      index: -1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          data: "Block 2",
        } as Transaction),
      ],
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("Should NOT be valid (data)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          data: "",
        } as Transaction),
      ],
    } as Block);
    block.transactions = [];
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });
  test("Should NOT be valid (timestemp)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          data: "Block 2",
        } as Transaction),
      ],
    } as Block);
    block.timestamp = 0;
    block.hash = block.getHash();
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });
  test("Should NOT be valid (hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          data: "Block 2",
        } as Transaction),
      ],
    } as Block);
    block.mine(exempleDifficulty, exampleMiner);
    block.hash = "";
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });
  test("Should NOT be valid (no mined)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          data: "Block 2",
        } as Transaction),
      ],
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);
    console.log(valid.message);
    expect(valid.sucess).toBeFalsy();
    expect(valid.message).toStrictEqual("No mined");
  });

  test("Should create from block info", () => {
    const block = Block.fromBlockInfo({
      transactions: [
        new Transaction({
          data: "Block 2",
        } as Transaction),
      ],
      difficulty: exempleDifficulty,
      feePerTx: 1,
      index: 1,
      maxDifficulty: 62,
      previousHash: genesis.hash,
    });
    block.mine(exempleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);
    console.log(valid.message);
    expect(valid.sucess).toBeTruthy();
  });

  test("Should NOT be valid two fee transaction", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          data: "Block 2",
          type: TransactionType.FEE,
        } as Transaction),
        new Transaction({
          data: "Block 3",
          type: TransactionType.FEE,
        } as Transaction),
      ],
    } as Block);
    block.mine(exempleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });

  test("Should NOT be valid tx invalid", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          data: "",
          type: TransactionType.FEE,
        } as Transaction),
      ],
    } as Block);
    block.mine(exempleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exempleDifficulty);
    expect(valid.sucess).toBeFalsy();
  });
  test("Should NOT be valid (invalid previous hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          data: "abc",
          type: TransactionType.FEE,
        } as Transaction),
      ],
    } as Block);
    block.previousHash = "wrong";
    block.mine(0, "a");

    const valid = block.isValid(genesis.hash, genesis.index, 0);
    expect(valid.message).toBe("Invalid previusHash");
  });
});
