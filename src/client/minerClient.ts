import axios from "axios";
import dotenv from "dotenv";
import Block from "../lib/block";
import BlockInfo from "../lib/blockInfo";
dotenv.config();

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;
const minnerWallet = {
  privateKey: "123456",
  publicKey: `${process.env.MINER_WALLET}`,
};
let totalMined = 0;

async function mine() {
  console.log("Getting next block info...");
  const { data } = await axios.get(`${BLOCKCHAIN_SERVER}blocks/next`);
  if (!data) {
    console.log("No tx found. Waiting...");
    return setTimeout(() => {
      mine();
    }, 5000);
  }
  const blockInfo = data as BlockInfo;
  const newBlock = Block.fromBlockInfo(blockInfo);
  console.log(`Start mining block #${newBlock.index}`);
  newBlock.mine(blockInfo.difficulty, minnerWallet.publicKey);
  console.log("Block mined! Sending to blockchain...");

  try {
    await axios.post(`${BLOCKCHAIN_SERVER}blocks/`, newBlock);
    console.log("Block sent and accepted!");
    totalMined++;
    console.log(`Total mined blocks: ${totalMined}`);
  } catch (error: any) {
    console.error(error.response ? error.response.data : error.message);
  }
  setTimeout(() => {
    mine();
  }, 1000);
}

mine();
