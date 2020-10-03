# react-socketio-chatapp
Chat App build with React, Express and Socket.io


### Installation

Install the dependencies and devDependencies and start the application. Server listens PORT 5000 and client runs on PORT 3000

```sh
$ git clone https://github.com/anilasimbilen/react-socketio-chatapp.git
$ npm install -d
$ npm install --prefix client
$ npm install --prefix server
$ npm start
```
### Configuration
Configure the server address on `client/constants/config.js`
```js
export const SERVER_ADDRESS = "<SERVER_ADDRESS_HERE>"; // e.g. http://localhost:5000
```
