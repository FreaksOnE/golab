const app = require(`express`)();
const http = require(`http`).Server(app);
const io = require(`socket.io`)(http);

const mongoose = require(`mongoose`);
const timerModel = require(`./models/timer.js`);

const Gpio = require(`onoff`).Gpio; //eslint-disable-line
const pinControllers = [];

// Configuring Mangoose
const mongoDB = `mongodb://localhost:27017/test`;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on(`error`, console.error.bind(console, `MongoDB connection error:`));

/* return all timers from db */
function getTimers(params) {
	return new Promise((resolve, reject) => {
		timerModel.find({}, (err, result) => {
			if (err) {
				reject(err);
			}
			resolve(result);
		});
	});
}

/* init GPIO pins on the rpi */
function initPins() {
	getTimers().then((res) => {
		res.forEach((elem) => {
			const tempPin = new Gpio(17, `out`);
			pinControllers[elem.portNum] = tempPin;
		});
	});
}

initPins();

/* add timer to db */
function addTimer(params) {
	return new Promise((resolve, reject) => {
		if (!params.onTime || !params.offTime) {
			reject();
		}
		const timerObj = new timerModel();
		timerObj.timerType = params.timerType;
		timerObj.initialOnTime = params.onTime;
		timerObj.initialOffTime = params.offTime;
		timerObj.onTime = params.onTime;
		timerObj.offTime = params.offTime;
		timerObj.tag = params.tag;
		timerObj.portNum = params.portNum;

		timerObj.save((err, result) => {
			if (err) {
				reject(err);
			}
			resolve(result);
		});
	});
}

/* edit timer by id */
function editTimer(params) {
	return new Promise((resolve, reject) => {
		if (!params.id || !params.patch) {
			reject();
		}
		timerModel.where({ _id: params.id }).findOne((err, result) => {
			if (err) {
				reject(err);
			}
			result.update(
				{
					status: params.patch.status,
					timerType: params.patch.timerType,
					initialOnTime: params.patch.onTime,
					initialOffTime: params.patch.offTime,
					onTime: params.patch.onTime,
					offTime: params.patch.offTime,
					tag: params.patch.tag,
					portNum: params.patch.portNum
				},
				() => {
					resolve(result);
				}
			);
		});
	});
}

/* start timer by id */
function startTimer(params) {
	return new Promise((resolve, reject) => {
		if (!params.id) {
			reject();
		}
		timerModel.where({ _id: params.id }).findOne((err, result) => {
			if (err) {
				reject(err);
			}
			result.update(
				{
					status: `active`
				},
				() => {
					resolve(result);
				}
			);
		});
	});
}

/* restart timer by id */
function restartTimer(params) {
	return new Promise((resolve, reject) => {
		if (!params.id) {
			reject();
		}
		timerModel.where({ _id: params.id }).findOne((err, result) => {
			if (err) {
				reject(err);
			}
			result.update(
				{
					status: `active`,
					onTime: result.initialOnTime,
					offTime: result.initialOffTime
				},
				() => {
					resolve(result);
				}
			);
		});
	});
}

/* pause timer by id */
function pauseTimer(params) {
	return new Promise((resolve, reject) => {
		if (!params.id) {
			reject();
		}
		timerModel.where({ _id: params.id }).findOne((err, result) => {
			if (err) {
				reject(err);
			}
			result.update(
				{
					status: `paused`
				},
				() => {
					resolve(result);
				}
			);
		});
	});
}

/* stop timer by id */
function stopTimer(params) {
	return new Promise((resolve, reject) => {
		if (!params.id) {
			reject();
		}
		timerModel.where({ _id: params.id }).findOne((err, result) => {
			if (err) {
				reject(err);
			}
			result.update(
				{
					status: `stopped`,
					onTime: result.initialOnTime,
					offTime: result.initialOffTime
				},
				() => {
					resolve(result);
				}
			);
		});
	});
}

/* delete timer by id */
function deleteTimer(params) {
	return new Promise((resolve, reject) => {
		if (!params.id) {
			reject();
		}
		timerModel.deleteOne({ _id: params.id }, (err, result) => {
			if (err) {
				reject(err);
			}
			resolve(result);
		});
	});
}

/* turn on a pin by pin number */
function turnPinOn(e) {
	e.writeSync(1);
}

/* turn on a pin by pin number */
function turnPinOff(e) {
	e.writeSync(0);
}

/* one minute tick event */
function minuteTick() {
	return new Promise((resolve, reject) => {
		timerModel.find({ status: `active` }, (err, result) => {
			if (err) {
				reject(err);
			}
			result.forEach((elem) => {
				const tempOnTime = parseInt(elem.onTime, 10);
				const tempOffTime = parseInt(elem.offTime, 10);

				if (tempOffTime > 0) {
					/* output pin will be LOW */
					turnPinOff(pinControllers[elem.portNum]);
					elem.update({ offTime: tempOffTime - 1 }).exec();
				} else if (tempOnTime > 0) {
					/* output pin will be HIGH */
					turnPinOn(pinControllers[elem.portNum]);
					elem.update({ onTime: tempOnTime - 1 }).exec();
				}
				/* restart timer on finish */
				if (tempOnTime < 1 && tempOffTime < 1) {
					turnPinOff(pinControllers[elem.portNum]);
					elem.update({ onTime: elem.initialOnTime, offTime: elem.initialOffTime }).exec();
				}
			});
			resolve();
		});
	});
}

setInterval(() => {
	minuteTick().then(() => {
		getTimers().then((e) => {
			// console.log(e);
		});
	});
}, 1000);


/*  */
app.get(`/`, (req, res) => {
	res.sendFile(`${__dirname}/static/index.html`);
});

/* connection */
io.on(`connection`, (socket) => {
	console.log(`a user connected`);

	/* send all timers to socket */
	getTimers().then((res) => {
		socket.emit(`timers`, res);
	});

	/* listen for update timer event */
	socket.on(`update timers`, (payload) => {
		/* send back all timers */
		getTimers().then((res) => {
			socket.emit(`timers`, res);
		});
	});

	/* listen for add timer event */
	socket.on(`add timer`, (payload) => {
		console.log(`add timer`);
		addTimer(payload).then(() => {
			/* send back all timers */
			getTimers().then((res) => {
				socket.emit(`timers`, res);
			});
		}).catch((err) => {
			console.log(err);
		});
	});

	/* listen for edit timer event */
	socket.on(`edit timer`, (res) => {
		console.log(`edit timer`);
		editTimer(res).then(() => {

		});
	});

	/* listen for start timer event */
	socket.on(`start timer`, (res) => {
		console.log(`start timer`);
		startTimer(res).then(() => {

		});
	});

	/* listen for restart timer event */
	socket.on(`restart timer`, (res) => {
		console.log(`restart timer`);
		restartTimer(res).then(() => {

		});
	});

	/* listen for pause timer event */
	socket.on(`pause timer`, (res) => {
		console.log(`pause timer`);
		pauseTimer(res).then(() => {

		});
	});

	/* listen for stop timer event */
	socket.on(`stop timer`, (res) => {
		console.log(`stop timer`);
		stopTimer(res).then(() => {

		});
	});

	/* listen for delete timer event */
	socket.on(`delete timer`, (res) => {
		console.log(`delete timer`);
		deleteTimer(res).then(() => {

		}).catch((err) => {
			console.log(err);
		});
	});

	/* listen for restart event */
	socket.on(`restart`, (res) => {
		console.log(`restart`);
	});

	/* listen for power off event */
	socket.on(`power off`, (res) => {
		console.log(`power off`);
	});

	/* listen for disconnect event */
	socket.on(`disconnect`, (res) => {
		console.log(`user disconnected`);
	});
});

http.listen(80, () => {
	console.log(`listening on *:80`);
});
