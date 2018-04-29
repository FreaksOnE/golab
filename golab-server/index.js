var express = require("express"); 
var app = express();
var server = require("http").createServer(app);
var morgan = require("morgan");
var bodyParser = require("body-parser");
var sqlite3 = require("sqlite3");

//var timerModel = require("./models/timer.js");

var gpio = require("rpi-gpio");
  
var db = new sqlite3.Database("golab.db", [], () => {
	console.log("db opened successfully");
});

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

//var whitelist = ["http://localhost:8080", "http://192.168.1.10:3001", "http://192.168.1.10", "*", ];
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




// gpio.setup(11, gpio.DIR_OUT);
/*timerModel.find({}, (err, result) => {
	if(err){
		console.log(err);
	}
	if(result.length > 0) {
		result.forEach(elem => {
			gpio.setup(elem.portNum , gpio.DIR_OUT);
		});
	}
});*/

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: true, }));
app.use(bodyParser.json());

var port = process.env.PORT || 3001; 

var router = express.Router(); 

function timerTick() {
	db.all("SELECT * FROM timers WHERE status='active'", (err, result) => {
		if(result.length > 0) {
			var allQueries = "";
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
				/*if(result[i].offTime === 0){
					gpio.write(result[i].portNum, true, (err) => {
						if (err) throw err;
						//console.log("pin "+result[i].portNum+" is on");
					});
				} else {
					gpio.write(result[i].portNum, false, (err) => {
						if (err) throw err;
					});
				}*/
				var query = "UPDATE timers SET onTime="+result[i].onTime+", offTime="+result[i].offTime+" WHERE _id="+result[i].id;
				allQueries += query + "\n";
				db.all(query, [], (err) => {
					if (err) {
						console.log(err);
					}
				});
			}
			//console.log(allQueries);
		} else {
			//console.log("no timers atm.");
		}
	});	
}

router.all("/*", (req, res, next) => {
	//res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Content-Type", "application/json");
	//console.log(req.params);
	return next();
});

router.get("/", (req, res) => {
	res.json({ message: "use /api", });
	return;
});

router.route("/timers").get((req, res) => {

	db.all("SELECT * FROM timers", [], (err, result) => {
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
		console.log(result);

		if(result.length > 0){
			res.json( 
				{
					"done": "ok",
					"data": result,
				},
			);
		} else {
			res.json( 
				{
					"done": "ok",
					"data": [],
				},
			);
		}
		return;
	});
}).post((req, res) => {
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
	console.log(req.body.status);
	
	var query = "INSERT INTO timers (status, timerType, onTime, offTime, initialOnTime, initialOffTime, tag, portNum) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

	db.all(query, [req.body.status, req.body.timerType, req.body.onTime, req.body.offTime, req.body.onTime, req.body.offTime, req.body.tag, req.body.portNum,], (err) => {
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
	});

});

router.route("/timers/:timer_id").get((req, res) => {
	var timerID = req.params.timer_id;

	var query = "SELECT * FROM timers WHERE _id=?";
	db.all(query, [timerID,], (err, result) => {
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
	var cu_initialOnTime, cu_initialOffTime;

	

	if(req.body.status === "restart"){
		db.get("SELECT initialOnTime, initialOffTime FROM timers WHERE id="+timerID, [], (err, result) => {
			cu_initialOffTime = result.initialOffTime;
			cu_initialOnTime = result.initialOnTime;
			var query = "UPDATE timers SET status=?, onTime=?, offTime=? WHERE _id=?";
			db.get(query, ["active", cu_initialOnTime, cu_initialOffTime,], (err) => {
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
			});
		});
	} else {
		var query = "UPDATE timers SET status=?, timerType=?, onTime=?, offTime=? WHERE _id=?";
		db.get(query, ["active", cu_initialOnTime, cu_initialOffTime,], (err) => {
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
		});
	}
}).delete((req, res) => {
	var timerID = req.params.timer_id;

	var query = "DELETE	FROM timers WHERE _id="+timerID;
	db.get(query, [], (err) => {
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
	});
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
