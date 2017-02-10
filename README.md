# auctions
Auction house history browser for World of Warcraft 1.12.1

## install

```
git clone
npm install -g yarn
yarn install
```

## run

```
docker-compose up -d mongo
npm run watch
```

## upload data

navigate to `http://localhost:3002/upload` and upload your `Aux-Addon.lua`

## dependencies

The original icon pack is not included. You will need the original icon pack from somewhere, https://github.com/mangostools/aowow/tree/develop/images/icons for example, and copy the icons folder under `src/client/resources/img`
