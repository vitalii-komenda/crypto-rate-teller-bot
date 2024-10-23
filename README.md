# Crypto rate telegram bot

A Telegram inline bot that provides cryptocurrency exchange rates for fiat money and also shows the difference from the previous invocation.
Deployes with [serverless](https://serverless.com/) specifically to AWS Lambda.

[https://t.me/CryptoRateTeller_bot](https://t.me/CryptoRateTeller_bot)

## Installation on your server
Generate token using https://t.me/BotFather.
Set the token in serverless.yml under the environment section.
Don't forget to set AWS_DYNAMO_ENDPOINT and the right role name

#### Install packages
```
npm i
npm install serverless -g
```
#### Deploy to AWS Lambda
```
serverless deploy

# Install telegram webhook
curl -F "url=https://[RETURNED_LINK]/dev/cryptorateteller" https://api.telegram.org/bot[TELEGRAM_TOKEN]/setWebhook
```

## Testing
```
npm run test
```

## Debugging
#### Logs
```
serverless logs -f cryptorateteller
```
#### Test with debugger
```
npm run test-debug
```


## Usage
#### Go to a user or channel and type currency that you want to know the exchange rate for
```
@CryptoRateTeller_bot uah
```
Currently supported UAH, USD, EUR

#### Reply example

1 BTC **472901.66 UAH**

1 XRP  **81.91 UAH**

1 ETH **32242.44 UAH**

1 EOS **292.3573 UAH**

1 KRB **47.57 UAH**

1 IOT **123.29 UAH**

1 LTC **7921.10 UAH**

1 UAH **1.00 UAH**

1 ZEC **22245.29 UAH**
