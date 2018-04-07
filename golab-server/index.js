var express = require("express"); 
var app = express();
var server = require("http").createServer(app);
var morgan = require("morgan");
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var timerModel = require("./models/timer.js");

var gpio = require("rpi-gpio");
  
// eslint-disable-next-line
/*function writeTest() {
	var pinVal = true;
	setInterval(() => {
		gpio.write(11, pinVal, (err) => {
			if (err) throw err;
			pinVal = !pinVal;
			console.log("11 is "+pinVal+".\r");
		});
	}, 1000);
}*/

var cors = require("cors");

var whitelist = ["http://localhost:8080", "http://192.168.1.10:3001", "http://192.168.1.10", "*", ];
var corsOptions = {
	origin: function (origin, callback) {
		callback(null, true);
		return;
		/*if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}*/
	},
};

app.use(cors());

// Configuring Mangoose
var mongoDB = "mongodb://localhost:27017/golab-test";
//var mongoDB = 'mongodb://chatUser:123@ds249718.mlab.com:49718/chatdb';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// gpio.setup(11, gpio.DIR_OUT);
timerModel.find({}, (err, result) => {
	if(result.length > 0) {
		result.forEach(elem => {
			gpio.setup(elem.portNum , gpio.DIR_OUT);
		});
	}
});

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: true, }));
app.use(bodyParser.json());

var port = process.env.PORT || 3001; 

var router = express.Router(); 

function timerTick() {
	//console.log("tick");
	timerModel.find(
		{
			status: "active",
		},	(err, result) => {
			if(result.length > 0) {
				for(var i = 0; i < result.length; i++){
					if(result[i].offTime > 0){
						result[i].offTime -= 1;
					} else {
						result[i].onTime -= 1;
					}
					if(result[i].onTime < 0){
						result[i].onTime = result[i].initialOnTime;
						result[i].offTime = result[i].initialOffTime;
					}
					if(result[i].offTime === 0){
						gpio.write(result[i].portNum, true, (err) => {
							if (err) throw err;
							//console.log("pin "+result[i].portNum+" is on");
						});
					} else {
						gpio.write(result[i].portNum, false, (err) => {
							if (err) throw err;
							//console.log("pin "+result[i].portNum+" is off");
						});
					}
					result[i].save();
				}
			}
		});
}

router.all("/*", (req, res, next) => {
	//res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Content-Type", "application/json");
	console.log("yo");	
	//console.log(req.params);
	return next();
});

router.get("/", (req, res) => {
	res.json({ message: "use /api", });
	return;
});

router.route("/timers").get((req, res) => {
	timerModel.find((err, result) => {
		if(err){
			console.log(err);
			res.json(
				{
					"done": "error",
					"code": "0",
				},
			);
			return;
		}
		res.json( 
			{
				"done": "ok",
				"data": result,
			},
		);
		return;
	});
}).post((req, res) => {
	var newTimer = new timerModel();
	if(
		req.body.status === undefined || 
		req.body.timerType === undefined || 
		req.body.onTime === undefined ||
		req.body.offTime === undefined ||
		req.body.tag === undefined ||
		req.body.portNum === undefined
	) {
		res.json(
			{
				"done": "error",
				"code": "1",
				"message": "Provide information",
			},
		);
		return;
	}
	
	newTimer.status = req.body.status;
	newTimer.timerType = req.body.timerType;
	newTimer.initialOnTime = req.body.onTime;
	newTimer.initialOffTime = req.body.offTime;
	newTimer.tag = req.body.tag;
	newTimer.portNum = req.body.portNum;

	newTimer.onTime = req.body.onTime;
	newTimer.offTime = req.body.offTime;


	newTimer.save((err, result) => {
		if(err){
			console.log(err);
			res.json( 
				{
					"done": "error",
					"code": "0",
				},
			);
			return;
		}
		res.json( 
			{
				"done": "ok",
				"data": result,
			},
		);
		return;
	});
});

router.route("/timers/:timer_id").get((req, res) => {
	var timerID = req.params.timer_id;

	timerModel.findById(timerID,
		(err, result) => {
			if(err){
				console.log(err);
				res.json( 
					{
						"done": "error",
						"code": "0",
					},
				);
				return;
			}
			res.json( 
				{
					"done": "ok",
					"data": result,
				},
			);
			return;
		});
}).put((req, res) => {
	if(
		req.body.status === undefined || 
		req.body.timerType === undefined || 
		req.body.onTime === undefined ||
		req.body.offTime === undefined ||
		req.body.tag === undefined ||
		req.body.portNum === undefined
	) {
		res.json(
			{
				"done": "error",
				"code": "1",
				"message": "Provide information",
			},
		);
		return;
	}

	var timerID = req.params.timer_id;

	timerModel.findById(timerID,
		(err, result) => {
			if(err){
				console.log(err);
				res.json( 
					{
						"done": "error",
						"code": "0",
					},
				);
				return;
			}
			result.status = req.body.status;
			result.timerType = req.body.timerType;
			result.initialOnTime = req.body.onTime;
			result.initialOffTime = req.body.offTime;
			result.tag = req.body.tag;
			result.portNum = req.body.portNum;

			if(result.status === "restart"){
				result.onTime = result.initialOnTime;
				result.offTime = result.initialOffTime;
				result.status = "active";
			}

			result.save((err, saveResult) => {
				if(err){
					console.log(err);
					res.json( 
						{
							"done": "error",
							"code": "0",
						},
					);
					return;
				}
				res.json( 
					{
						"done": "ok",
						"data": saveResult,
					},
				);
				return;
			});
		});
}).delete((req, res) => {
	var timerID = req.params.timer_id;

	timerModel.remove(
		{
			_id: timerID,
		},
		(err) => {
			if(err){
				console.log(err);
				res.json( 
					{
						"done": "error",
						"code": "0",
					},
				);
				return;
			}
			res.json( 
				{
					"done": "ok",
				},
			);
			return;
		}
	);
});


app.use("/api", router);

app.use((req, res, next) => {
	res.status(404);
	res.json( 
		{
			"done": "error",
			"code": "404",
		},
	);
	next();
});

setInterval(() => {
	timerTick();
},1000);

server.listen(port, "::", () => { // "192.168.42.221",
	console.log("Server listening at port %d", port);
});
