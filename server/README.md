# sg.statuslog Simple Mock Server
A mock server implementation of the sg.statuslog API.

This server is implemented in TypeScript for NodeJs.

This is called a mock server, because it does not have any data persistency.
All data is only stored in memory.

## Setup
```
cd ./server
npm install
```

## Run
```
npm start
```
Server restarts when code in `src` directory is changed.

## Crosspile
```
npm run build
```

## Test Code & Code Coverage
Using Jest:
```
npm run test
```

Inspect:
[./coverage/lcov-report/index.html](./coverage/lcov-report/index.html)
