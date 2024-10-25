import Block from "../src/block";

describe("Block tests", () => {
  test("Should be valid", () => {
    const block = new Block(1, "abc", "Genesis")
    const valid = block.isValid();
    expect(valid).toBeTruthy()
  })

  test("Should NOT be valid (previusHash)", () => {
    const block = new Block(1, "", "Genesis")
    const valid = block.isValid();
    expect(valid).toBeFalsy()
  })

  test("Should NOT be valid (index)", () => {
    const block = new Block(-1, "", "Genesis")
    const valid = block.isValid();
    expect(valid).toBeFalsy()
  })

  test("Should NOT be valid (data)", () => {
    const block = new Block(1, "abc", "Genesis")
    block.data = ""
    const valid = block.isValid();
    expect(valid).toBeFalsy()
  })
  test("Should NOT be valid (timestemp)", () => {
    const block = new Block(1, "abc", "Genesis")
    block.timestamp = 0
    const valid = block.isValid();
    expect(valid).toBeFalsy()
  })
  test("Should NOT be valid (hash)", () => {
    const block = new Block(1, "abc", "Genesis")
    block.hash = ""
    const valid = block.isValid();
    expect(valid).toBeFalsy()
  })
})