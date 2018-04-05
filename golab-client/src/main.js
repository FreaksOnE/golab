// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Vuex from "vuex";
import iView from "iview/dist/iview.min";
import App from "./App";
import router from "./router";
import axios from "axios";

import "iview/dist/styles/iview.css";
import "./theme.less";

var apiAddr = process.env.API_ADDR;

Vue.use(Vuex);
Vue.use(iView);

Vue.config.productionTip = false;

const store = new Vuex.Store({
	state: {
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
			{
				_id: 1,
				status: "paused",
				timerType: "lamp",
				onTime: 234,
				offTime: 23,
				initialOnTime: 237,
				initialOffTime: 28,
				tag: "timer2",
				portNum: 0,
			},
			{
				_id: 2,
				status: "stopped",
				timerType: "fan",
				onTime: 22,
				offTime: 7,
				initialOnTime: 24,
				initialOffTime: 7,
				tag: "timer3",
				portNum: 0,
			},
			{
				_id: 3,
				status: "active",
				timerType: "pump",
				onTime: 55,
				offTime: 3,
				initialOnTime: 55,
				initialOffTime: 3,
				tag: "timer4",
				portNum: 0,
			},
		],
	},
	getters: {
		getTimers: state => state.timers,
	},
	mutations: {
		RESTART_TIMER: (state, payload) => {
			var elem = state.timers.filter(elem => elem.timerType === payload.type && elem._id === payload.id);
			elem[0].onTime = elem[0].initialOnTime;
			elem[0].offTime = elem[0].initialOffTime;

		},
		REMOVE_TIMER: (state, payload) => {
			//console.log(state.timers.filter(elem => elem.timerType === payload.type));
			var elem = state.timers.filter(elem => elem.timerType === payload.type && elem._id === payload.id);
			var elemIndex = state.timers.indexOf(elem[0]);
			state.timers.splice(elemIndex, 1);
			//console.log(state.timers.filter(elem => elem.timerType === payload.type));
		},
		CHANGE_STATUS: (state, payload) => {
			var elem = state.timers.filter(elem => elem.timerType === payload.type && elem._id === payload.id);
			console.log(elem[0]._id);
			console.log(payload.id);
			elem[0].status = payload.value;
			if(elem[0].status === "stopped"){
				elem[0].onTime = elem[0].initialOnTime;
				elem[0].offTime = elem[0].initialOffTime;
			}
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
	},
	actions: {
		restartTimer: (context, payload) => {
			context.commit("RESTART_TIMER", payload);
		},
		removeTimer: (context, payload) => {
			context.commit("REMOVE_TIMER", payload);
		},
		changeStatus: (context, payload) => {
			context.commit("CHANGE_STATUS", payload);
		},
		timerTick: (context) => {
			context.commit("TIMER_TICK");
		},
		/*addTimer: () => {
			var temp = [];
			store.getters.getTimers.forEach(elem => {
				temp.push(elem._id);
			});
			//const max = Math.max(...temp);

			var newTimer = {
				_id: max+1,
				status: "active",
				timerType: payload.type,
				onTime: payload.onTime,
				offTime: payload.offTime,
				initialOnTime: payload.onTime,
				initialOffTime: payload.offTime,
				tag: payload.tag,
				portNum: payload.portNum,
			};
			newTimer;


			//context.commit("ADD_TIMER", payload);
		},*/
		fetchTimers: (context) => {
			console.log(apiAddr);
			axios.get("http://"+"localhost:3001/api"+"/timers").then(response => {
				context.commit("FETCH_TIMERS", response.data.data);
			}).catch(err => {
				if(err.message === "Network Error"){
					console.log("Error: Server unreachable.");
				} else {
					console.log(err.message);
				}
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
		store.dispatch("fetchTimers");
	},
	mounted: function() {
		this.timer = setInterval(this.timerSec, 1000);
	},
	methods: {
		timerSec: function(){
			store.dispatch("timerTick");
		},
	},
});
