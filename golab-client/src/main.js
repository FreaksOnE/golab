// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Vuex from "vuex";
import iView from "iview/dist/iview.min";
import App from "./App";
import router from "./router";
import axios from "axios";

//import $ from "jquery";

import "iview/dist/styles/iview.css";
import "animate.css/animate.min.css";
import "./theme.less";

axios.defaults.headers.common["Content-Type"] = "application/x-www-form-urlencoded";
axios.defaults.headers.common["Accept"] = "application/json;";

import qs from "qs";

//require("axios-debug")(axios);

var apiAddr = process.env.API_ADDR;

Vue.use(Vuex);
Vue.use(iView);

Vue.config.productionTip = false;

const store = new Vuex.Store({
	state: {
		preLoad: true,
		timers: [
			{
				_id: 0,
				status: "active",
				timerType: "lamp",
				onTime: 12,
				offTime: 13,
				initialOnTime: 12,
				initialOffTime: 13,
				tag: "timer1",
				portNum: 0,
			},
		],
	},
	getters: {
		getTimers: state => state.timers,
		getPreLoad: state => state.preLoad,
	},
	mutations: {
		RESTART_TIMER: (state, payload) => {
			var elem = state.timers.find(elem => elem.timerType === payload.type && elem._id === payload.id);
			elem.onTime = elem.initialOnTime;
			elem.offTime = elem.initialOffTime;
			elem.status = "restart";
			store.dispatch("editTimer", elem);
		},
		REMOVE_TIMER: (state, payload) => {
			//console.log(state.timers.filter(elem => elem.timerType === payload.type));
			var elem = state.timers.filter(elem => elem.timerType === payload.type && elem._id === payload.id);
			var elemIndex = state.timers.indexOf(elem[0]);
			state.timers.splice(elemIndex, 1);
			//console.log(state.timers.filter(elem => elem.timerType === payload.type));
		},
		CHANGE_STATUS: (state, payload) => {
			var elem = state.timers.find(elem => elem.timerType === payload.type && elem._id === payload.id);
			elem.status = payload.value;
			if(elem.status === "stopped"){
				elem.onTime = elem.initialOnTime;
				elem.offTime = elem.initialOffTime;
			}
			store.dispatch("editTimer", elem);
		},
		TIMER_TICK: state => {
			var elems = state.timers.filter(elem => elem.status === "active");
			elems.forEach((elem) => {
				if(elem.offTime > 0){
					elem.offTime -= 1;
				} else {
					elem.onTime -= 1;
				}
				if(elem.onTime < 0){
					elem.onTime = elem.initialOnTime;
					elem.offTime = elem.initialOffTime;
				}
			});
		},
		FETCH_TIMERS: (state, payload) => {
			state.timers = payload;
		},
		CHANGE_PRE_LOAD: (state, payload) => {
			state.preLoad = payload;
		},
	},
	actions: {
		restartTimer: (context, payload) => {
			context.commit("RESTART_TIMER", payload);
		},
		changeStatus: (context, payload) => {
			context.commit("CHANGE_STATUS", payload);
		},
		timerTick: (context) => {
			context.commit("TIMER_TICK");
		},
		addTimer: (context, payload) => {
			var newTimer = {
				status: "active",
				timerType: payload.type,
				onTime: payload.onTime,
				offTime: payload.offTime,
				tag: payload.tag,
				portNum: payload.portNum,
			};

			return new Promise((resolve, reject) => {
				console.log("POST: "+apiAddr+"/timers");
				axios.post(apiAddr+"/timers", qs.stringify(newTimer)).then((response) => {
					if(response.data.done === "ok"){
						store.dispatch("fetchTimers");
						resolve();
					} else {
						reject();
					}
				}).catch(err => {
					if(err.message === "Network Error"){
						console.log("Error: Server unreachable.");
					} else {
						console.log(err.message);
					}
				});
			});
		},
		fetchTimers: (context) => {
			return new Promise((resolve, reject) => {
				console.log(apiAddr+"/timers");
				axios.get(apiAddr+"/timers").then(response => {
					if(response.data.done === "ok"){
						if(response.data.data.length > 0){
							response.data.data.forEach((elem) => {
								elem.selected = false;
							});
							context.commit("FETCH_TIMERS", response.data.data);
						} else {
							context.commit("FETCH_TIMERS", []);
						}
						resolve();
					} else {
						reject();
					}
				}).catch(err => {
					if(err.message === "Network Error"){
						console.log("Error: Server unreachable.");
					} else {
						console.log(err.message);
					}
					reject();
				});
			});
		},
		changePreLoad: (context, payload) => {
			context.commit("CHANGE_PRE_LOAD", payload);
		},
		removeTimer: (context, payload) => {
			return new Promise((resolve, reject) => {
				console.log("POST: "+apiAddr+"/timers/"+payload);
				axios.delete(apiAddr+"/timers/"+payload).then((response) => {
					if(response.data.done === "ok"){
						store.dispatch("fetchTimers");
						resolve();
					} else {
						console.log(response);
						reject();
					}
				}).catch(err => {
					if(err.message === "Network Error"){
						console.log(err);
						console.log("Error: Server unreachable.");
					} else {
						console.log(err.message);
					}
					reject();
				});
			});
		},
		editTimer: (context, payload) => {
			console.log(payload);
			return new Promise((resolve, reject) => {
				console.log("PUT: "+apiAddr+"/timers/"+payload._id);
				axios.put(apiAddr+"/timers/"+payload._id, {
					status: payload.status,
					timerType: payload.timerType,
					onTime: payload.initialOnTime,
					offTime: payload.initialOffTime,
					tag: payload.tag,
					portNum: payload.portNum,
				}).then((response) => {
					if(response.data.done === "ok"){
						store.dispatch("fetchTimers");
						resolve();
					} else {
						console.log(response);
						reject();
					}
				}).catch(err => {
					if(err.message === "Network Error"){
						console.log(err);
						console.log("Error: Server unreachable.");
					} else {
						console.log(err.message);
					}
					reject();
				});
			});
		},
	},
});

/* eslint-disable no-new */
new Vue({
	el: "#app",
	router,
	store: store,
	components: { App, },
	template: "<App/>",
	created: function() {
		store.dispatch("fetchTimers").then(() => {
			store.dispatch("changePreLoad", false);
			console.log("resolve");
		});
	},
	mounted: function() {
		this.timer = setInterval(this.timerSec, 1000);
		//this.timer = setInterval(this.refreshTimers, 10000);
	},
	methods: {
		timerSec: function(){
			store.dispatch("timerTick");
		},
		refreshTimers: function(){
			store.dispatch("fetchTimers");
		},
	},
});
