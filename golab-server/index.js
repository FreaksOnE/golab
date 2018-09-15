const app = require(`express`)();
const http = require(`http`).Server(app);
const io = require(`socket.io`)(http);

const mongoose = require(`mongoose`);
const timerModel = require(`./models/timer.js`);

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

/* add timer to db */
function addTimer(params) {
	return new Promise((resolve, reject) => {
		if (!params.onTime || !params.offTime) {
			reject();
		}
		const timerObj = new timerModel();
		timerObj.initialOnTime = params.onTime;
		timerObj.initialOffTime = params.offTime;
		timerObj.onTime = params.onTime;
		timerObj.offTime = params.offTime;

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

/* delete timer by id */
function deleteTimer(params) {
	return new Promise((resolve, reject) => {
		if (!params.id) {
			reject();
		}
		timerModel.where({ _id: params.id }).findOneAndDelete((err, result) => {
			if (err) {
				reject(err);
			}
			resolve(result);
		});
	});
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
					elem.update({ offTime: tempOffTime - 1 }).exec();
				} else {
					elem.update({ onTime: tempOnTime - 1 }).exec();
				}
				/* restart time on finish */
				if (tempOnTime === 0 && tempOffTime === 0) {
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
			console.log(e);
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

	/* listen for delete timer event */
	socket.on(`delete timer`, (res) => {
		console.log(`delete timer`);
		deleteTimer(res).then(() => {

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

http.listen(3000, () => {
	console.log(`listening on *:3000`);
});
