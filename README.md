# Crypto rate bot

A Telegram inline bot for getting cryptocurrency exchange rates.
Its structured via [serverless](https://serverless.com/) and can be deployed to AWS Lambda.

The code is written on nodejs 8 and compiled down to nodejs 6 by babel, because AWS Lambda does not support nodejs 8 yet.

[https://t.me/CryptoRateTeller_bot](https://t.me/CryptoRateTeller_bot)

## Installation
Generate token using https://t.me/BotFather.
Put the token in serverless.yml under environment section

### Install packages
```
npm i
npm install serverless -g
```
#### To run locally 
```
serverless invoke local --function cryptorateteller
```
#### To deploy to AWS Lambda
```
serverless deploy

# Install telegram webhook
curl -F "url=https://[RETURNED_LINK]/dev/cryptorateteller" https://api.telegram.org/bot[TELEGRAM_TOKEN]/setWebhook
```


## Usage
#### Go to an user or group and type to bot currency that you want to know exchange rate for
```
@CryptoRateTeller_bot uah
```

#### Reply example

1 BTC **468071.17 UAH**

1 XRP  **81.4444 UAH**

1 ETH **31767.9903 UAH**

1 EOS **292.3573 UAH**

1 KRB **46.2080 UAH**

1 IOT **125.1622 UAH**

1 LTC **7858.9149 UAH**

1 UAH **0.9998 UAH**

1 ZEC **21620.2073 UAH**
