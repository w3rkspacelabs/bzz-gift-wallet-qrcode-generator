import dotenv from "dotenv";
import { getDefaultProvider, Wallet, Contract } from "ethers";
import { writeFile } from "fs/promises";

// ABI
import abi from "./abi.json" assert { type: "json" };
import erc20 from "./erc20.json" assert { type: "json" };

// Env
dotenv.config();
const {
  RPC,
  PRIVATE_KEY,
  CONTRACT_ADDRESS,
  BZZ_ADDRESS,
  TOKEN_AMOUNT,
  NATIVE_AMOUNT,
  WALLET_COUNT,
} = process.env;

console.log({
  RPC,
  PRIVATE_KEY,
  CONTRACT_ADDRESS,
  BZZ_ADDRESS,
  TOKEN_AMOUNT,
  NATIVE_AMOUNT,
  WALLET_COUNT,
});

// process.exit(0);

const wallets = [];
const walletsCSV = [];

const id = Date.now()

// Generate wallets
for (let i = 0; i < WALLET_COUNT; i++) {
  const { address, privateKey } = Wallet.createRandom();
  wallets.push({address,privateKey});
  walletsCSV.push(`${address},${privateKey}`);
}

// Write them to file
await writeFile(`wallets/wallets-${id}.json`, JSON.stringify(wallets));
await writeFile(`wallets/wallets-${id}.csv`, walletsCSV.join("\n"));
console.log({
  filesCreated:{
    json: `wallets/wallets-${id}.json`,
    json: `wallets/wallets-${id}.csv`
  }
})
// process.exit(0);

// Wallet setup
const provider = getDefaultProvider(RPC);
const wallet = new Wallet(PRIVATE_KEY, provider);
const funder = new Contract(CONTRACT_ADDRESS, abi, wallet, {
  gasLimit: 1_000_000,  
  gasPrice: 1_000_000_000,
});
let tx;

// Approve BZZ
const token = new Contract(BZZ_ADDRESS, erc20, wallet);
// console.log({TOKEN_AMOUNT})
// process.exit(0)
tx = await token.approve(
  CONTRACT_ADDRESS,
  BigInt(TOKEN_AMOUNT) * BigInt(wallets.length)
);
await tx.wait();
console.log("Approve transaction mined");

// Fund them
tx = await funder.fund(
  BZZ_ADDRESS,
  TOKEN_AMOUNT,
  NATIVE_AMOUNT,
  wallets.map(({ address }) => address),
  { value: BigInt(NATIVE_AMOUNT) * BigInt(wallets.length) }
);

await tx.wait();
console.log("Funding transaction mined");
