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
Then inspect: ./coverage/lcov-report/index.html

## Powershell Debugging During Development
```
for ($i = 1; $i -le 10; $i++) { $c = Invoke-WebRequest -Method "POST" -Uri "http://localhost:8000/status/event/" -Headers @{ "Content-Type"="application/json" }  -Body ( @{entity='e1';value='g';validFor=1;link="http://$i"} | ConvertTo-Json) }

invoke-webrequest http://localhost:8000/status/event/?limit=4

for ($i = 1; $i -le 10; $i++) { $c = Invoke-WebRequest -Method "POST" -Uri "http://localhost:8000/status/future-value/" -Headers @{ "Content-Type"="application/json" } -Body ( @{ value='g';validFor=1;link="http://$i"} | ConvertTo-Json) }

invoke-webrequest http://localhost:8000/status/future-value/ | ConvertFrom-Json

```
