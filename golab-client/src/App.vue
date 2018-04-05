<template>
	<div id="app">
		<div class="layout">
			<Layout>
				<Header>
					<div class="layout-logo" />
					<div class="layout-status">
						<Row>
							<i-col span="8" offset="8">
								<p>
									<Icon type="connection-bars"></Icon>Server: Online</p>
							</i-col>
							<i-col span="8">
								<p>
									<Icon type="plus"></Icon>Total Timers: {{ timers.length }}</p>
							</i-col>
						</Row>
					</div>
				</Header>
				<layout>
					<Sider hide-trigger :width="300">
						<div class="sider-tabs">
							<Tabs @on-click="handleSiderTab" type="card">
								<TabPane name="create" label="Add" icon="plus"></TabPane>
								<TabPane name="edit" label="Edit" icon="edit"></TabPane>
							</Tabs>
						</div>
						<div class="sider-content">
						<Row>
							<i-col span="20" offset="2">
								<div class="title">Add new timer</div>
							</i-col>
						</Row>
						<Row>
							<i-col span="20" offset="2">
								<Form>
									<FormItem label="Tag">
										<Input icon="pricetag" v-model="formItem.tag" placeholder="Enter tag..." style="width: 217px" />
									</FormItem>
									<FormItem label="">
										<TimePicker type="time" value="ZZ" v-model="formItem.onTime" placeholder="On time ex. 00:00:00" style="width: 100%"></TimePicker>
									</FormItem>
									<FormItem label="">
										<TimePicker type="time" value="ZZ" v-model="formItem.offTime" placeholder="Off time ex. 00:00:00" style="width: 100%"></TimePicker>
									</FormItem>
									<FormItem label="Type">
										<RadioGroup v-model="formItem.type">
											<Radio label="lamp">Lamp</Radio>
											<Radio label="pump">Pump</Radio>
											<Radio label="fan">Fan</Radio>
										</RadioGroup>
									</FormItem>
									<FormItem label="Port number">
										<InputNumber :max="10" :min="1" :step="1" v-model="formItem.portNum"></InputNumber>
									</FormItem>
									<FormItem>
										<Button type="primary" long :loading="formItem.loading" @click="submitTimer">
											<span v-if="!formItem.loading">Add Timer</span>
											<span v-else>Loading...</span>
										</Button>
									</FormItem>
								</Form>
							</i-col>
						</Row>
						</div>
					</Sider>
					<Content :style="{padding: '10px 50px'}">
						<Tabs @on-click="handleTimerTab">
							<TabPane name="all" label="All" icon="asterisk"></TabPane>
							<TabPane name="lamp" label="Lamp" icon="lightbulb"></TabPane>
							<TabPane name="pump" label="Pump" icon="waterdrop"></TabPane>
							<TabPane name="fan" label="Fan" icon="thermometer"></TabPane>
						</Tabs>
						<div class="timer-container">
							<transition name="fade">
							<Row v-if="groupedTimers[showTab].length === 0">
								<i-col span="24" offset="0">
									<Row>
										<i-col span="24" offset="0">
											<p>Use the form to create content.</p>
										</i-col>
									</Row>
									<Row>
										<i-col span="24" offset="0">
											<img src="./assets/plus-bg.svg"/>
										</i-col>
									</Row>
								</i-col>
							</Row>
							</transition>
							<Row v-for="(timerRow, index) in groupedTimers[showTab]" :gutter="16" :key="index">
								<transition-group name="fade" mode="out-in">
									<i-col :xs="24" :sm="24" :md="12" :lg="6" v-for="(timerElem, index2) in timerRow" :key="index2" :class="timerElem.timerType" v-if="showTab === 'all' || showTab === timerElem.timerType">
										<Card :bordered="true" shadow style="width: auto;" :class="timerElem.status">
											<p slot="title" style="line-height:20px;">
												<icon v-if="timerElem.timerType === 'lamp'" type="lightbulb"></icon>
												<icon v-else-if="timerElem.timerType === 'pump'" type="waterdrop"></icon>
												<icon v-else-if="timerElem.timerType === 'fan'" type="thermometer"></icon>
												{{ timerElem.tag }}
												<Cascader :data="data" @on-change="cardDoAction($event, timerElem._id)" :key="timerElem._id">
													<Icon type="android-more-vertical"></Icon>
												</Cascader>
											</p>
											<Row style="min-width: 170px;">
												<i-col span="8" style="text-align: center;">
													<icon type="android-time" :class="{ active: !timerElem.offTime && timerElem.status != 'stopped' }" style="cursor: default;"></icon>
												</i-col>
												<i-col span="16">
													<Row>
														<i-col span="12">
															<p style="text-align:right;">On Time:</p>
														</i-col>
														<i-col span="12">
															<p style="text-align:left;">{{ formatTime(timerElem.onTime) }}</p>
														</i-col>
													</Row>
													<Row>
														<i-col span="12">
															<p style="text-align:right;">Off Time:</p>
														</i-col>
														<i-col span="12">
															<p style="text-align:left;">{{ formatTime(timerElem.offTime) }}</p>
														</i-col>
													</Row>
												</i-col>
											</Row>
										</Card>
									</i-col>
								</transition-group>
							</Row>
						</div>
					</Content>
					<fab @change="fabChange($event.val)" :main-icon="fabItem.icon" :position="fabItem.position" :bg-color="fabItem.bgColor" :actions="fabItem.fabActions" @cache="cache" @alertMe="alert" :class="{ open: fabOpen }"></fab>
				</layout>
				<Footer class="layout-footer-center">2018 &copy;</Footer>
			</Layout>
		</div>
	</div>
</template>

<script>
import _ from "lodash";
import fab from "@/components/fab";

var cuformItem = {
	tag: "",
	onTime: "",
	offTime: "",
	type: "lamp",
	portNum: 0,
	loading: false,
};

export default {
	name: "App",
	components: {
		fab,
	},
	mounted: function() {

	},
	data: function() {
		return {
			fabOpen: false,
			showTab: "all",
			formItem: cuformItem,
			fabItem: {
				bgColor: "#495060",
				position: "bottom-right",
				icon: "settings",
				fabActions: [
					{
						name: "restart",
						icon: "refresh",
					},
					{
						name: "powerOff",
						icon: "power_settings_new",
					},
				],
			},
			data: [
				{
					value: "active",
					label: "Start",
					disabled: false,
				},
				{
					value: "paused",
					label: "Pause",
					disabled: false,
				},
				{
					value: "stopped",
					label: "Stop",
					disabled: false,
				},
				{
					value: "restart",
					label: "Restart",
				},
				{
					value: "remove",
					label: "Remove",
				},
			],
		};
	},
	computed: {
		groupedTimers() {
			var allTimers = this.timers;
			var lampTimers = allTimers.filter(timer => timer.timerType === "lamp");
			var fanTimers = allTimers.filter(timer => timer.timerType === "fan");
			var pumpTimers = allTimers.filter(timer => timer.timerType === "pump");
			return {
				all: _.chunk(allTimers, 4),
				lamp: _.chunk(lampTimers, 4),
				fan: _.chunk(fanTimers, 4),
				pump: _.chunk(pumpTimers, 4),
			};
		},
		timers() {
			return this.$store.getters.getTimers;
		},
	},
	methods: {
		formatTime: function(val) {
			var tempDate = new Date(val * 1000);
			//console.log(tempDate);
			var tempHours = tempDate.getUTCHours();
			if (tempHours < 10) {
				tempHours = "0" + tempHours;
			} else {
				tempHours.toString();
			}
			var tempMinutes = tempDate.getUTCMinutes();
			if (tempMinutes < 10) {
				tempMinutes = "0" + tempMinutes;
			} else {
				tempMinutes.toString();
			}
			var tempSeconds = tempDate.getUTCSeconds();
			if (tempSeconds < 10) {
				tempSeconds = "0" + tempSeconds;
			} else {
				tempSeconds.toString();
			}
			return tempHours + ":" + tempMinutes + ":" + tempSeconds;
		},
		cardDoAction: function(val, elem) {
			var thisCard = this.timers.find(el => el._id === elem);

			//var temp = this.timers.filter(elem => elem.timerType === thisCard.timerType);
			if (val[0] === "restart") {
				this.$store.dispatch("restartTimer", {
					type: thisCard.timerType,
					id: thisCard._id,
				});
			} else if (val[0] === "remove") {
				//console.log("rm");
				this.$store.dispatch("removeTimer", {
					type: thisCard.timerType,
					id: thisCard._id,
				});
			} else if (
				val[0] === "active" ||
        val[0] === "paused" ||
        val[0] === "stopped"
			) {
				console.log(thisCard._id);
				this.$store.dispatch("changeStatus", {
					type: thisCard.timerType,
					id: thisCard._id,
					value: val[0],
				});
			}
		},
		submitTimer: function() {
			var elem = this.formItem;

			elem.loading = true;

			if (elem.tag === "") elem.tag = "Timer";

			var cuOnTime = new Date("Jan 1, 1970, " + elem.onTime + " GMT+00:00");
			var cuOffTime = new Date("Jan 1, 1970, " + elem.offTime + " GMT+00:00");

			this.$store.dispatch("addTimer", {
				tag: elem.tag,
				onTime: cuOnTime.getTime() / 1000,
				offTime: cuOffTime.getTime() / 1000,
				type: elem.type,
				portNum: elem.portNum,
			});

			//console.log(cuOnTime.getUTCHours() + ":" + cuOnTime.getUTCMinutes() + ":" + cuOnTime.getUTCSeconds());

			elem.tag = "";
			elem.onTime = "";
			elem.offTime = "";
			elem.type = "lamp";
			elem.portNum = 0;

			setTimeout(() => {
				elem.loading = false;
			}, 200);
		},
		cache: function() {
			console.log("Cache Cleared");
		},
		alert: function() {
			alert("Clicked on alert icon");
		},
		handleTimerTab: function(tab) {
			this.showTab = tab;
		},
		handleSiderTab: function() {
			
		},
		fabChange: function(val){
			this.fabOpen = val;
		},
	},
};
</script>

<style>
@font-face {
  font-family: "Material Icons";
  font-style: normal;
  font-weight: 400;
  src: url("./assets/fonts/MaterialIcons-Regular.eot");
  /* For IE6-8 */
  src: local("Material Icons"), local("MaterialIcons-Regular"),
    url("./assets/fonts/MaterialIcons-Regular.svg#MaterialIcons-Regular")
      format("svg"),
    url("./assets/fonts/MaterialIcons-Regular.woff2") format("woff2"),
    url("./assets/fonts/MaterialIcons-Regular.woff") format("woff"),
    url("./assets/fonts/MaterialIcons-Regular.ttf") format("truetype");
}

.material-icons {
  font-family: "Material Icons";
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  user-select: none;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: "liga";
}

/* Rules for sizing the icon. */

.material-icons.md-18 {
  font-size: 18px;
}

.material-icons.md-24 {
  font-size: 24px;
}

.material-icons.md-36 {
  font-size: 36px;
}

.material-icons.md-48 {
  font-size: 48px;
}

/* Rules for using icons as black on a light background. */

.material-icons.md-dark {
  color: rgba(0, 0, 0, 0.54);
}

.material-icons.md-dark.md-inactive {
  color: rgba(0, 0, 0, 0.26);
}

/* Rules for using icons as white on a dark background. */

.material-icons.md-light {
  color: rgba(255, 255, 255, 1);
}

.material-icons.md-light.md-inactive {
  color: rgba(255, 255, 255, 0.3);
}

.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.layout-logo {
  width: 100px;
  height: 30px;
/*  background: #5b6270;*/
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}

.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}

.layout-status {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}

.layout-status .ivu-icon {
  font-size: 14px;
  padding: 25px 8px;
  float: left;
}

.layout-footer-center {
  text-align: center;
}
</style>