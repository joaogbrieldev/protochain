import request from "supertest";
import Block from "../src/lib/block";
import { app } from "../src/server/blockchainServer";

jest.mock("../src/lib/block");
jest.mock("../src/lib/blockchain");
describe("BlockchainServer Tests", () => {
  test("GET /status", async () => {
    const response = await request(app).get("/status/");
    expect(response.body.isValid.sucess).toEqual(true);
  });

  test("GET /blocks/:index", async () => {
    const response = await request(app).get(`/blocks/${0}`);
    expect(response.status).toEqual(200);
    expect(response.body.index).toEqual(0);
  });

  test("GET /blocks/next - should next block", async () => {
    const response = await request(app).get("/blocks/next/");
    expect(response.body.index).toEqual(1);
    expect(response.status).toEqual(200);
  });

  test("GET /blocks/:hash", async () => {
    const response = await request(app).get("/blocks/abc");
    expect(response.status).toEqual(200);
    expect(response.body.hash).toEqual("abc");
  });

  test("GET /blocks/:indexOrHash error", async () => {
    const response = await request(app).get(`/blocks/${-1}`);
    expect(response.status).toEqual(404);
    expect(response.body.index).toEqual(undefined);
  });

  test("GET /blocks/:indexOrHash error", async () => {
    const response = await request(app).get(`/blocks/${-1}`);
    expect(response.status).toEqual(404);
    expect(response.body.index).toEqual(undefined);
  });

  test("GET /blocks/:indexOrHash error", async () => {
    const response = await request(app).get(`/blocks/${-1}`);
    expect(response.status).toEqual(404);
    expect(response.body.index).toEqual(undefined);
  });

  test("POST /blocks - should add block", async () => {
    const block = new Block({ index: 1 } as Block);
    const response = await request(app).post(`/blocks`).send(block);
    expect(response.status).toEqual(201);
    expect(response.body.index).toEqual(1);
  });

  test("POST /blocks - should not add block 422", async () => {
    const response = await request(app).post(`/blocks`).send({});
    expect(response.status).toEqual(422);
    expect(response.body.index).toEqual(undefined);
  });

  test("POST /blocks - should not add block 400", async () => {
    const block = new Block({ index: -1 } as Block);
    const response = await request(app).post(`/blocks`).send(block);
    expect(response.status).toEqual(400);
    expect(response.body.index).toEqual(undefined);
  });
});
