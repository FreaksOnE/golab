<template>
	<div id="app">
		<transition name="fade">
		<div id="pre-loader" v-if="preLoad">
			<Spin size="large"></Spin>
		</div>
		</transition>
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
				<layout :class="{ 'edit-mode': editMode }">
					<Sider :width="300" collapsible :collapsed-width="78" v-model="isCollapsed" @on-collapse="handleSiderCollapse">
						<div class="sider-tabs">
							<Tabs @on-click="handleSiderTab" type="card">
								<TabPane name="create" label="Add" icon="plus"></TabPane>
								<TabPane name="edit" label="Edit" icon="edit"></TabPane>
							</Tabs>
						</div>
						<div class="sider-content">
							<Row>
								<transition name="sider-content-slide" enter-active-class="animated slideInLeft" leave-active-class="animated slideOutLeft">
									<i-col span="24" v-show="siderOpen">
										<Row>
											<i-col span="20" offset="2">
												<div class="title">
												<p v-if="!editMode">Add new timer</p>
												<p v-if="editMode">Edit timer</p>
												</div>
											</i-col>
										</Row>
										<Row>
											<i-col span="20" offset="2">
												<Form>
													<FormItem label="Tag">
														<Input icon="pricetag" v-model="formItem.tag" placeholder="Enter tag..." style="max-width: 217px" />
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
														<Button v-if="!editMode" type="primary" long :loading="formItem.loading" @click="submitTimer">
															<span v-if="!formItem.loading">Add Timer</span>
															<span v-else>Loading...</span>
														</Button>
														<Button v-if="editMode" type="success" long :loading="formItem.loading" @click="editTimer">
															<span v-if="!formItem.loading">Submit</span>
															<span v-else>Loading...</span>
														</Button>
													</FormItem>
													<FormItem>
														<Button disabled type="primary" long :loading="formItem.loading" @click="submitTimer">
															<span v-if="!formItem.loading">Add Button
																<icon type="information-circled" />
															</span>
															<span v-else>Loading...</span>
														</Button>
													</FormItem>
												</Form>
											</i-col>
										</Row>
									</i-col>
								</transition>

								<transition name="sliderIconIn" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
									<div class="siderCollapsedMenu" v-show="!siderOpen">
										<Row>
											<i-col span="24">
												<p style="transform: rotate(90deg)">OPEN</p>
											</i-col>
										</Row>
									</div>
								</transition>
							</Row>
						</div>
					</Sider>
					<Content :style="{padding: '10px 50px'}">
						<Tabs @on-click="handleTimerTab">
							<TabPane :disabled="editMode" name="all" label="All" icon="asterisk"></TabPane>
							<TabPane :disabled="editMode" name="lamp" label="Lamp" icon="lightbulb"></TabPane>
							<TabPane :disabled="editMode" name="pump" label="Pump" icon="waterdrop"></TabPane>
							<TabPane :disabled="editMode" name="fan" label="Fan" icon="thermometer"></TabPane>
						</Tabs>
						<div class="timer-container">
							<transition name="fade">
								<Row v-show="groupedTimers[showTab].length === 0">
									<i-col span="24" offset="0">
										<!--<Row>
										<i-col span="24" offset="0">
											<p>Use the form to create content.</p>
										</i-col>
									</Row>-->
										<Row>
											<i-col span="24" offset="0">
												<img :disabled="editMode" src="./assets/plus-bg.png" style="width: 400px;margin: auto;position: absolute;left: 0;right: 0;padding: 75px 0;z-index:0;" />
											</i-col>
										</Row>
									</i-col>
								</Row>
							</transition>
							<Row v-for="(timerRow, index) in groupedTimers[showTab]" :gutter="16" :key="index">
								<transition-group name="fade" mode="out-in">
									<i-col :xs="24" :sm="24" :md="12" :lg="6" v-for="(timerElem, index2) in timerRow" :key="index2" :class="timerElem.timerType"
									v-if="showTab === 'all' || showTab === timerElem.timerType">
										<Card @click.native="handleCardClick(timerElem._id)" :bordered="true" shadow style="width: auto;" :class="[timerElem.status, { 'edit-mode': editMode, 'selected': timerElem.selected }]">
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
													<icon type="android-time" :class="{ active: !timerElem.offTime && timerElem.status != 'stopped' && !editMode }" style="cursor: default;"></icon>
												</i-col>
												<i-col span="16">
													<Row>
														<i-col span="12">
															<p style="text-align:right;">On Time:</p>
														</i-col>
														<i-col span="12">
															<p v-if="!editMode" style="text-align:left;">{{ formatTime(timerElem.onTime) }}</p>
															<p v-if="editMode" style="text-align:left;">{{ formatTime(timerElem.initialOnTime) }}</p>
														</i-col>
													</Row>
													<Row>
														<i-col span="12">
															<p style="text-align:right;">Off Time:</p>
														</i-col>
														<i-col span="12">
															<p v-if="!editMode" style="text-align:left;">{{ formatTime(timerElem.offTime) }}</p>
															<p v-if="editMode" style="text-align:left;">{{ formatTime(timerElem.initialOffTime) }}</p>
														</i-col>
													</Row>
												</i-col>
											</Row>
											<div v-if="editMode" class="cover"/>
										</Card>
									</i-col>
								</transition-group>
							</Row>
						</div>
					</Content>
					<fab :disabled="editMode" @change="fabChange($event.val)" :main-icon="fabItem.icon" :position="fabItem.position" :bg-color="fabItem.bgColor" :actions="fabItem.fabActions"
					@restart="restartServer" @powerOff="powerOffServer" :class="{ open: fabOpen }"></fab>
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
	mounted: function () { },
	data: function () {
		return {
			editMode: false,
			isCollapsed: false,
			siderOpen: true,
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
		preLoad() {
			return this.$store.getters.getPreLoad;
		},
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
		formatTime: function (val) {
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
		cardDoAction: function (val, elem) {
			var thisCard = this.timers.find(el => el._id === elem);

			//var temp = this.timers.filter(elem => elem.timerType === thisCard.timerType);
			if (val[0] === "restart") {
				this.$store.dispatch("restartTimer", {
					type: thisCard.timerType,
					id: thisCard._id,
				}).then(() => {
					this.$Notice.success({
						title: "Timer Restarted.",
						duration: 2,
					});
				});
			} else if (val[0] === "remove") {
				//console.log("rm");
				this.$store.dispatch("removeTimer", thisCard._id).then(() => {
					this.$Notice.success({
						title: "Timer removed.",
						duration: 2,
					});
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
				}).then(() => {
					this.$Notice.success({
						title: "Timer status changed.",
						duration: 2,
					});
				});
			}
			
		},
		submitTimer: function () {
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
				this.$Notice.success({
					title: "Timer Added successfully.",
					duration: 2,
				});
			}, 200);
		},
		restartServer: function() {
			this.$Notice.warning({
				title: "Restarting server.",
				duration: 2,
			});
		},
		powerOffServer: function() {
			this.$Notice.error({
				title: "Shutting down server.",
				duration: 2,
			});
		},
		handleTimerTab: function (tab) {
			this.showTab = tab;
		},
		handleSiderTab: function (val) { 
			cuformItem.tag = "";
			cuformItem.onTime = "";
			cuformItem.offTime = "";
			cuformItem.type = "lamp";
			cuformItem.portNum = 0;

			if(val === "edit"){
				this.editMode = true;
				this.$Notice.open({
					title: "Select a timer for editing.",
					duration: 2,
				});
			} else {
				this.timers.forEach(elem => {
					elem.selected = false;
				});
				this.editMode = false;
			}
		},
		fabChange: function (val) {
			this.fabOpen = val;
		},
		handleSiderCollapse: function (val) {
			this.siderOpen = !val;
		},
		handleCardClick: function (val) {
			var timerVal = this.timers.find(elem => elem._id === val);
			if(this.editMode){
				this.timers.forEach(elem => {
					elem.selected = false;
				});
				timerVal.selected = true;
				cuformItem.tag = timerVal.tag;
				cuformItem.onTime = this.formatTime(timerVal.initialOnTime);
				cuformItem.offTime = this.formatTime(timerVal.initialOffTime);
				cuformItem.type = timerVal.timerType;
				cuformItem.portNum = timerVal.portNum;
			}
		},
		editTimer: function() {
			var timerElem = this.timers.find(elem => elem.selected === true);
			
			var cuOnTime = new Date("Jan 1, 1970, " + this.formItem.onTime + " GMT+00:00");
			var cuOffTime = new Date("Jan 1, 1970, " + this.formItem.offTime + " GMT+00:00");

			timerElem.status = "restart";
			timerElem.tag = this.formItem.tag;
			timerElem.initialOnTime = cuOnTime.getTime() / 1000;
			timerElem.initialOffTime = cuOffTime.getTime() / 1000;
			timerElem.timerType = this.formItem.type;
			timerElem.portNum = this.formItem.portNum;

			this.$store.dispatch("editTimer", timerElem).then(() => {
				this.$Notice.success({
					title: "Timer edited.",
					duration: 2,
				});
			});
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
		url("./assets/fonts/MaterialIcons-Regular.svg#MaterialIcons-Regular") format("svg"),
		url("./assets/fonts/MaterialIcons-Regular.woff2") format("woff2"),
		url("./assets/fonts/MaterialIcons-Regular.woff") format("woff"),
		url("./assets/fonts/MaterialIcons-Regular.ttf") format("truetype");
	}

	.ivu-card > .cover {
		height: 100%;
		width: 100%;
		z-index: 100;
		cursor: pointer;
	}

.ivu-card > .cover::hover {
	background: rgba(0, 0, 0, 0.1);
}

	.slideInLeft {
		animation: slideInLeft 0.4s;
	}

	.slideOutLeft {
		animation: slideOutLeft 1s;
	}

	.slideInRight {
		animation: slideInRight .4s;
	}

	.slideOutRight {
		animation: slideOutRight .4s;
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
		float: right;
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