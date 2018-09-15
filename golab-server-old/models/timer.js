var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var timerSchema = new Schema({
	status: {
		type: String,
		default: "active",
		enum: ["active", "paused", "stopped",],
	},
	timerType: {
		type: String,
		default: "lamp",
		enum: ["lamp", "pump", "fan","undef",],
	},
	onTime: {
		type: Number,
		default: 0,
	},
	offTime: {
		type: Number,
		default: 0,
	},
	initialOnTime: {
		type: Number,
		default: 0,
	},
	initialOffTime: {
		type: Number,
		default: 0,
	},
	tag: {
		type: String,
		default: "Timer",
	},
	portNum: {
		type: Number,
		default: 0,
	},
});

module.exports = mongoose.model("timerModel", timerSchema);