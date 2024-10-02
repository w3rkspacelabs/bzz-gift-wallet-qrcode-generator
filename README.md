# Gift Wallet & QRCOde Generator

## Requirements

- `node` (>= `18`)
- `python3`

## 1. Project Setup

```
git clone https://github.com/rampall/bzz-gift-wallet-qrcode-generator.git
cd bzz-gift-wallet-qrcode-generator
npm install
cp .env.sample .env
```

## 2. Edit `.env`

- Set the in `PRIVATE_KEY` (without `0x` prefix) in `.env` with the wallet used to generate gift codes
- Set your `RPC`, `TOKEN_AMOUNT`, `NATIVE_AMOUNT`, `WALLET_COUNT` values

## 3. generate gift wallets and codes

Run:
```
node index.js
```
This will generate a `.json` and a `.csv` file with the list of wallet address and gift codes

## 4. generate qr codes

Run:
```
python3 generate-qrcode.py <WALLETS-CSV-FILE-PATH>
```
where `WALLETS-CSV-FILE-PATH` is the csv file frtom previous step
This will generate a bunch of qrcode svg files and a `qrcodes.html` in the `qrcodes` folder

## 5. print pdf

Open the generated `qrcodes.html` in a browser and press `CTRL + P` to save as PDF
