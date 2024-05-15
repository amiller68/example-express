# example express

simple example of an express server with a mongodb backend

## Reuirements

docker (or podman) & npm 10.x

## Setup
```bash
npm i
```

## Running MongoDB
```bash
npm run mongodb
```

## Running the dev server
```bash
# Defaults should work, but it's a good idea to
#  - update the cron job in the .env file to run faster
#   for development
#  - update the bitcoin rpc endpoint to your own
cp .env.example .env
source .env
npm run dev
```


