<template>
  <div id="app">
	<div class="layout">
		<Layout>
			<Header>
				<div class="layout-logo"/>
				<div class="layout-status">
					<Row>
						<i-col span="8" offset="8"><p><Icon type="connection-bars"></Icon>Server: Online</p></i-col>
						<i-col span="8"><p><Icon type="plus"></Icon>Total Timers: {{ timers.length }}</p></i-col>
					</Row>
				</div>
			</Header>
			<layout>
				<Sider hide-trigger :width="300">
					<Row>
						<i-col span="20" offset="2"><div class="title">Add new timer</div></i-col>
					</Row>
					<Row>
						<i-col span="20" offset="2">
							<Form>
								<FormItem label="Tag">
									<Input icon="pricetag" v-model="formItem.tag" placeholder="Enter tag..." style="width: 217px"/>
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
				</Sider>
				<Content :style="{padding: '10px 50px'}">
					<Tabs>
						<TabPane label="All" icon="asterisk">
							<Row v-for="(timerRow, index) in groupedTimers"  :gutter="16" :key="index">
								<transition-group name="fade">
								<i-col :xs="24" :sm="24" :md="12" :lg="6" v-for="(timerElem, index2) in timerRow" :key="index2">
									<Card :bordered="true" shadow style="width: auto;" :class="timerElem.status" @click="timerElem.status = 'paused'">
										<p slot="title" style="line-height:20px;">
											<icon v-if="timerElem.timerType === 'lamp'" type="lightbulb"></icon>
											<icon v-else-if="timerElem.timerType === 'pump'" type="waterdrop"></icon>
											<icon v-else-if="timerElem.timerType === 'fan'" type="thermometer"></icon>
											{{ timerElem.tag }}
											<Cascader :data="data" @on-change="cardDoAction($event, timerElem._id)" :key="timerElem._id">
												<Icon type="android-more-vertical"></Icon>
											</Cascader>
										</p>
										<Row>
											<i-col span="8" style="text-align: center;"><icon type="android-time" :class="{ active: !timerElem.offTime && timerElem.status != 'stopped' }" style="cursor: default;"></icon></i-col>
											<i-col span="16">
												<Row>
													<i-col span="12"><p style="text-align:right;">On Time:</p></i-col>
													<i-col span="12"><p style="text-align:left;">{{ formatTime(timerElem.onTime) }}</p></i-col>
												</Row>
												<Row>
													<i-col span="12"><p style="text-align:right;">Off Time:</p></i-col>
													<i-col span="12"><p style="text-align:left;">{{ formatTime(timerElem.offTime) }}</p></i-col>
												</Row>
											</i-col>
										</Row>
									</Card>
								</i-col>
								</transition-group>
							</Row>

						</TabPane>
						<TabPane label="Lamp" icon="lightbulb">
							<Row v-for="(timerRow, index) in lampTimers"  :gutter="16" :key="index">
								<transition-group name="fade">
								<i-col :xs="24" :sm="24" :md="12" :lg="6" v-for="(timerElem, index2) in timerRow" :key="index2">
									<Card :bordered="true" shadow style="width: auto;" :class="timerElem.status" @click="timerElem.status = 'paused'">
										<p slot="title" style="line-height:20px;">
											<icon v-if="timerElem.timerType === 'lamp'" type="lightbulb"></icon>
											<icon v-else-if="timerElem.timerType === 'pump'" type="waterdrop"></icon>
											<icon v-else-if="timerElem.timerType === 'fan'" type="thermometer"></icon>
											{{ timerElem.tag }}
											<Cascader :data="data" @on-change="cardDoAction($event, timerElem._id)" :key="timerElem._id">
												<Icon type="android-more-vertical"></Icon>
											</Cascader>
										</p>
										<Row>
											<i-col span="8" style="text-align: center;"><icon type="android-time" :class="{ active: !timerElem.offTime && timerElem.status != 'stopped' }" style="cursor: default;"></icon></i-col>
											<i-col span="16">
												<Row>
													<i-col span="12"><p style="text-align:right;">On Time:</p></i-col>
													<i-col span="12"><p style="text-align:left;">{{ formatTime(timerElem.onTime) }}</p></i-col>
												</Row>
												<Row>
													<i-col span="12"><p style="text-align:right;">Off Time:</p></i-col>
													<i-col span="12"><p style="text-align:left;">{{ formatTime(timerElem.offTime) }}</p></i-col>
												</Row>
											</i-col>
										</Row>
									</Card>
								</i-col>
								</transition-group>
							</Row>
						</TabPane>
						<TabPane label="Pump" icon="waterdrop">
							<Row v-for="(timerRow, index) in pumpTimers"  :gutter="16" :key="index">
								<transition-group name="fade">
								<i-col :xs="24" :sm="24" :md="12" :lg="6" v-for="(timerElem, index2) in timerRow" :key="index2">
									<Card :bordered="true" shadow style="width: auto;" :class="timerElem.status" @click="timerElem.status = 'paused'">
										<p slot="title" style="line-height:20px;">
											<icon v-if="timerElem.timerType === 'lamp'" type="lightbulb"></icon>
											<icon v-else-if="timerElem.timerType === 'pump'" type="waterdrop"></icon>
											<icon v-else-if="timerElem.timerType === 'fan'" type="thermometer"></icon>
											{{ timerElem.tag }}
											<Cascader :data="data" @on-change="cardDoAction($event, timerElem._id)" :key="timerElem._id">
												<Icon type="android-more-vertical"></Icon>
											</Cascader>
										</p>
										<Row>
											<i-col span="8" style="text-align: center;"><icon type="android-time" :class="{ active: !timerElem.offTime && timerElem.status != 'stopped' }" style="cursor: default;"></icon></i-col>
											<i-col span="16">
												<Row>
													<i-col span="12"><p style="text-align:right;">On Time:</p></i-col>
													<i-col span="12"><p style="text-align:left;">{{ formatTime(timerElem.onTime) }}</p></i-col>
												</Row>
												<Row>
													<i-col span="12"><p style="text-align:right;">Off Time:</p></i-col>
													<i-col span="12"><p style="text-align:left;">{{ formatTime(timerElem.offTime) }}</p></i-col>
												</Row>
											</i-col>
										</Row>
									</Card>
								</i-col>
								</transition-group>
							</Row>
						</TabPane>
						<TabPane label="Fan" icon="thermometer">
							<Row v-for="(timerRow, index) in fanTimers"  :gutter="16" :key="index">
								<transition-group name="fade">
								<i-col :xs="24" :sm="24" :md="12" :lg="6" v-for="(timerElem, index2) in timerRow" :key="index2">
									<Card :bordered="true" shadow style="width: auto;" :class="timerElem.status" @click="timerElem.status = 'paused'">
										<p slot="title" style="line-height:20px;">
											<icon v-if="timerElem.timerType === 'lamp'" type="lightbulb"></icon>
											<icon v-else-if="timerElem.timerType === 'pump'" type="waterdrop"></icon>
											<icon v-else-if="timerElem.timerType === 'fan'" type="thermometer"></icon>
											{{ timerElem.tag }}
											<Cascader :data="data" @on-change="cardDoAction($event,timerElem._id)" :key="timerElem._id">
												<Icon type="android-more-vertical"></Icon>
											</Cascader>
										</p>
										<Row>
											<i-col span="8" style="text-align: center;"><icon type="android-time" :class="{ active: !timerElem.offTime && timerElem.status != 'stopped' }" style="cursor: default;"></icon></i-col>
											<i-col span="16">
												<Row>
													<i-col span="12"><p style="text-align:right;">On Time:</p></i-col>
													<i-col span="12"><p style="text-align:left;">{{ formatTime(timerElem.onTime) }}</p></i-col>
												</Row>
												<Row>
													<i-col span="12"><p style="text-align:right;">Off Time:</p></i-col>
													<i-col span="12"><p style="text-align:left;">{{ formatTime(timerElem.offTime) }}</p></i-col>
												</Row>
											</i-col>
										</Row>
									</Card>
								</i-col>
								</transition-group>
							</Row>
						</TabPane>
					</Tabs>
				</Content>
			</layout>
			<Footer class="layout-footer-center">2018 &copy;</Footer>
		</Layout>
	</div>
	</div>
</template>

<script>
import _ from "lodash";

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
	data: function() {
		return {
			formItem: cuformItem,
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
			return _.chunk(this.timers, 4);
			// returns a nested array: 
			// [[article, article, article], [article, article, article], ...]
		},
		lampTimers() {
			var temp = this.timers.filter(timer => timer.timerType === "lamp");
			return _.chunk(temp, 4);
		},
		pumpTimers() {
			var temp = this.timers.filter(timer => timer.timerType === "pump");
			return _.chunk(temp, 4);
		},
		fanTimers() {
			var temp = this.timers.filter(timer => timer.timerType === "fan");
			return _.chunk(temp, 4);
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
			if(tempHours < 10){
				tempHours = "0"+tempHours;
			} else {
				tempHours.toString();
			}
			var tempMinutes = tempDate.getUTCMinutes();
			if(tempMinutes < 10){
				tempMinutes = "0"+tempMinutes;
			} else {
				tempMinutes.toString();
			}
			var tempSeconds = tempDate.getUTCSeconds();
			if(tempSeconds < 10){
				tempSeconds = "0"+tempSeconds;
			} else {
				tempSeconds.toString();
			}
			return  tempHours+":"+tempMinutes+":"+tempSeconds;
		},
		cardDoAction: function(val, elem) {
			var thisCard = this.timers[elem];

			//var temp = this.timers.filter(elem => elem.timerType === thisCard.timerType);
			if(val[0] === "restart"){
				this.$store.dispatch("restartTimer", {"type": this.timers[elem].timerType, "id": thisCard._id,});
			} else if(val[0] === "remove"){
				//console.log("rm");
				this.$store.dispatch("removeTimer", {"type": this.timers[elem].timerType, "id": thisCard._id,});
			} else if(val[0] === "active" || val[0] === "paused" || val[0] === "stopped"){
				console.log(thisCard._id);
				this.$store.dispatch("changeStatus", {"type": this.timers[elem].timerType, "id": thisCard._id, "value": val[0],});
			}
		},
		submitTimer: function(){			
			var elem = this.formItem;
			
			elem.loading = true;

			if(elem.tag === "")
				elem.tag = "Timer";

			var cuOnTime = new Date("Jan 1, 1970, "+elem.onTime+" GMT+00:00");
			var cuOffTime = new Date("Jan 1, 1970, "+elem.offTime+" GMT+00:00");

			this.$store.dispatch("addTimer", {
				tag: elem.tag,
				onTime: (cuOnTime.getTime() / 1000),
				offTime: (cuOffTime.getTime() / 1000),
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
			},200);
			
		},
	},
};
</script>

<style>

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
  background: #5b6270;
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
