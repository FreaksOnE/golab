// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Vuex from "vuex";
import iView from "iview/dist/iview.min";
import App from "./App";
import router from "./router";
import io from "socket.io-client";

import "iview/dist/styles/iview.css";
import "animate.css/animate.min.css";
import "./theme.less";

Vue.use(Vuex);
Vue.use(iView);

Vue.config.productionTip = true;

var apiAddr = process.env.API_ADDR;
const socket = io.connect(apiAddr, { reconnect: true, });

const store = new Vuex.Store({
	state: {
		preLoad: false,
		socketConnected: false,
		timers: [
			/* {
				_id: 0,
				status: "active",
				timerType: "lamp",
				onTime: 12,
				offTime: 13,
				initialOnTime: 12,
				initialOffTime: 13,
				tag: "timer1",
				portNum: 0,
			}, */
		],
		selectedTimer: "",
	},
	getters: {
		getConnection: state => state.socketConnected,
		getTimers: state => state.timers,
		getPreLoad: state => state.preLoad,
		getSelectedTimer: state => state.selectedTimer,
	},
	mutations: {
		SET_CONNECTION: (state, payload) => {
			state.socketConnected = payload;
		},
		GET_TIMERS: (state, payload) => {
			socket.emit("update timers");
		},
		SET_TIMERS: (state, payload) => {
			state.timers = payload;
		},
		ADD_TIMER: (state, payload) => {
			socket.emit("add timer", {
				timerType: payload.timerType,
				onTime: payload.onTime,
				offTime: payload.offTime,
				tag: payload.tag,
				portNum: payload.portNum,
			});
		},
		EDIT_TIMER: (state, payload) => {
			socket.emit("edit timer", {
				id: payload._id,
				patch: payload,
			});
		},
		RESTART_TIMER: (state, payload) => {
			socket.emit("restart timer", {
				id: payload,
			});
		},
		START_TIMER: (state, payload) => {
			socket.emit("start timer", {
				id: payload,
			});
		},
		PAUSE_TIMER: (state, payload) => {
			socket.emit("pause timer", {
				id: payload,
			});
		},
		STOP_TIMER: (state, payload) => {
			socket.emit("stop timer", {
				id: payload,
			});
		},
		DELETE_TIMER: (state, payload) => {
			socket.emit("delete timer", {
				id: payload,
			});
		},
		SERVER_RESTART: () => {
			socket.emit("restart");
		},
		SERVER_POWEROFF: () => {
			socket.emit("power off");
		},
		SET_SELECTED_TIMER: (state, payload) => state.selectedTimer = payload, 
	},
	actions: {
		
	},
});

new Vue({
	el: "#app",
	router,
	store: store,
	components: { App, },
	created: function() {
		
	},
	mounted: function() {
		/* store.commit("ADD_TIMER", {
			_id: 0,
			status: "active",
			timerType: "lamp",
			onTime: 12,
			offTime: 13,
			initialOnTime: 12,
			initialOffTime: 13,
			tag: "timer1",
			portNum: 0,
		}); */
		setInterval(() => {
			this.$store.commit("GET_TIMERS");
		},1000);
	},
	methods: {
		timerTick: function(){
			
		},
		refreshTimers: function(){
			
		},
	},
	template: "<App/>",
});

socket.on("connect", () => {
	console.log("Connected!");
	store.commit("SET_CONNECTION", true);
});
	
/* add timers listener */
socket.on("timers", (e) => {
	store.commit("SET_TIMERS", e);
});
	
/* listen for tick event */
socket.on("tick", () => {
		
});

socket.on("disconnect", () => {
	console.log("disconnected");
	store.commit("SET_CONNECTION", false);
});
