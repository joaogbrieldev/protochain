import Block from "../src/block";

describe("Block tests", () => {
  let genesis: Block;
  beforeAll(() => {
    genesis = new Block({
      data: "Genesis Block",
    } as Block);
  });
  test("Should be valid", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "Block 2",
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.sucess).toBeTruthy();
  });

  test("Should NOT be valid (previusHash)", () => {
    const block = new Block({
      index: 1,
      previousHash: "abc",
      data: "Block 2",
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.sucess).toBeFalsy();
  });

  test("Should NOT be valid (index)", () => {
    const block = new Block({
      index: -1,
      previousHash: genesis.hash,
      data: "Block 2",
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.sucess).toBeFalsy();
  });

  test("Should NOT be valid (data)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "Block 2",
    } as Block);
    block.data = "";
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.sucess).toBeFalsy();
  });
  test("Should NOT be valid (timestemp)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "Block 2",
    } as Block);
    block.timestamp = 0;
    block.hash = block.getHash();
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.sucess).toBeFalsy();
  });
  test("Should NOT be valid (hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "Block 2",
    } as Block);
    block.hash = "";
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.sucess).toBeFalsy();
  });
});
