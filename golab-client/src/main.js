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
	},
	getters: {
		getTimers: state => state.timers,
		getPreLoad: state => state.preLoad,
	},
	mutations: {
		SET_TIMERS: (state, payload) => {
			state.timers = payload;
		},
		ADD_TIMER: (state, payload) => {
			socket.emit("add timer", {
				timerType: "pump",
				onTime: payload.onTime,
				offTime: payload.offTime,
				tag: "pump :)",
				portNum: "1",
			});
		},
		EDIT_TIMER: (state, payload) => {
			socket.emit("edit timer", {
				id: payload._id,
				patch: payload,
			});
		},
		DELETE_TIMER: (state, payload) => {
			socket.emit("delete timer", {
				id: payload._id,
			});
		},
		SERVER_RESTART: () => {
			socket.emit("restart");
		},
		SERVER_POWEROFF: () => {
			socket.emit("power off");
		},
	},
	actions: {
		
	},
});

new Vue({
	el: "#app",
	router,
	store: store,
	components: { App, },
	template: "<App/>",
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
	},
	methods: {
		timerTick: function(){
			
		},
		refreshTimers: function(){
			
		},
	},
});

socket.on("connect", () => {
	console.log("Connected!");
});
	
/* add timers listener */
socket.on("timers", (e) => {
	store.commit("SET_TIMERS", e);
});
	
/* listen for tick event */
socket.on("tick", () => {
		
});
