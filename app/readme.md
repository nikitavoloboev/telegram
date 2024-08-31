# Telegram Mini App

Mini app built on top of [Telegram mini app template](https://github.com/Telegram-Mini-Apps/reactjs-template).

Ideally one day it's moved to Next.js with app folder.

## Setup

Install [mkcert](https://github.com/FiloSottile/mkcert).

```
brew install mkcert
```

Get certificates:

```
mkcert --install
mkcert tma.internal
```

Move them for use:

```
mkdir certificates
mv tma.internal-key.pem certificates
mv tma.internal.pem certificates
```

Edit `/etc/hosts`:

```
sudo nvim /etc/hosts
```

Then add `127.0.0.1       tma.internal` line at the end and save (`:wq`).

Create Telegram mini app with [BotFather](https://telegram.me/BotFather).

```
/newapp
```

Then follow instructions.

Install dependencies:

```
bun i
```

Copy the URL: `https://tma.internal:5173/` and give it to BotFather.

Then in root `.env`, add:

```
LOCAL=true
```

Then:

```
bun app
```

Start the mini app and changes will reflect in the mini app as you edit them.

## Deploy

Connect to Vercel using these settings:

![](docs/images/vercel.png)

And add valid `RONIN_TOKEN` in env.
