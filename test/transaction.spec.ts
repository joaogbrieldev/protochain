import Transaction, { TransactionType } from "../src/lib/transaction";

describe("Transaction tests", () => {
  test("Should be valid (REGULAR)", () => {
    const tx = new Transaction({
      data: "Block 2",
    } as Transaction);

    const valid = tx.isValid();
    expect(valid.sucess).toBeTruthy();
  });

  test("Should be valid (REGULAR)", () => {
    const tx = new Transaction({
      data: "Block 2",
    } as Transaction);

    const valid = tx.isValid();
    expect(valid.sucess).toBeTruthy();
  });

  test("Should NOT be valid with not params(REGULAR)", () => {
    const tx = new Transaction({
      data: "tx",
      type: TransactionType.REGULAR,
      timestamp: Date.now(),
      hash: "abc",
    } as Transaction);
    const valid = tx.isValid();
    expect(valid.sucess).toBeFalsy();
  });

  test("Should be valid (FEE)", () => {
    const tx = new Transaction({
      data: "tx",
      type: TransactionType.FEE,
    } as Transaction);

    const valid = tx.isValid();
    expect(valid.sucess).toBeTruthy();
  });

  test("Should not be valid (data)", () => {
    const tx = new Transaction();
    const valid = tx.isValid();
    expect(valid.sucess).toBeFalsy();
  });

  test("Should not be valid (hash)", () => {
    const tx = new Transaction({
      data: "tx",
    } as Transaction);
    tx.hash = "abc";
    const valid = tx.isValid();
    expect(valid.sucess).toBeFalsy();
  });
});
