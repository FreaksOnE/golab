const io = require(`socket.io-client`);

const socket = io.connect(`http://localhost:3000`, { reconnect: true });

// Add a connect listener
socket.on(`connect`, (socket) => {
	console.log(`Connected!`);
});

/* add timers listener */
socket.on(`timers`, (socket) => {
	console.log(`got all timers`);
});

/* trigger restart event */
socket.emit(`restart`);

/* trigger power off event */
socket.emit(`power off`);
