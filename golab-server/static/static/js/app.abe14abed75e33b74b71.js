webpackJsonp([1],{"+skl":function(t,e){},0:function(t,e){},"0KfL":function(t,e){},"9Q9G":function(t,e){},EWot:function(t,e){},KwC3:function(t,e){},NHnr:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=i("7+uW"),a=i("NYxO"),n=i("fljr"),s=i.n(n),r=i("Dd8w"),l=i.n(r),c=i("M4fF"),m=i.n(c),d=i("WEHx"),p=i("WQHf"),u=i("lcOp"),f={name:"Fab",directives:{Ripple:p.a,tooltip:u.VTooltip},mixins:[d.mixin],props:{bgColor:{default:"#333333"},position:{default:"bottom-right"},positionType:{default:"fixed"},zIndex:{default:"999"},rippleShow:{default:!0},rippleColor:{default:"light"},mainIcon:{default:"add"},iconSize:{default:"medium"},mainTooltip:{default:null},fixedTooltip:{default:!1},actions:{default:function(){return[]}}},data:function(){return{toggle:!1,pos:{},tooltipPosition:"left"}},computed:{actionIconSize:function(){switch(this.iconSize){case"small":return"md-18";case"medium":return"md-24";case"large":return"md-36";default:return"md-24"}},mainIconSize:function(){switch(this.iconSize){case"small":return"md-24";case"medium":return"md-36";case"large":return"md-48";default:return"md-36"}},paddingAmount:function(){switch(this.iconSize){case"small":return"28px";case"medium":return"32px";case"large":return"38px";default:return"32px"}},listPos:function(){return"top-right"===this.position||"top-left"===this.position?{top:"-20px",paddingTop:"20px"}:{bottom:"-20px",paddingBottom:"20px"}},transitionEnter:function(){return this.animation.enter},transitionLeave:function(){return this.animation.leave},animation:function(){return"top-right"===this.position||"top-left"===this.position?{enter:"animated quick fadeInDown",leave:"animated quick fadeOutUp"}:"bottom-right"===this.position||"bottom-left"===this.position?{enter:"animated quick fadeInUp",leave:"animated quick fadeOutDown"}:{enter:"animated fadeInUp",leave:"animated fadeOutDown"}},tooltipTrigger:function(){return this.fixedTooltip?"manual":"hover"}},watch:{position:function(t){var e=this;this.setPosition(),this.$nextTick(function(){e.moveTransition(),e.tooltipPos()})},toggle:function(t){this.showTooltip(t),this.$emit("change",{val:t})}},mounted:function(){this.moveTransition()},created:function(){this.setPosition()},methods:{tooltipPos:function(){"top-right"===this.position||"bottom-right"===this.position?this.tooltipPosition="left":this.tooltipPosition="right"},toParent:function(t){this.$emit(t),this.toggle=!1},away:function(){this.toggle=!1},setPosition:function(){switch(this.pos={},this.position){case"bottom-right":this.pos.right="5vw",this.pos.bottom="4vh";break;case"bottom-left":this.pos.left="5vw",this.pos.bottom="4vh";break;case"top-left":this.pos.left="5vw",this.pos.top="4vh";break;case"top-right":this.pos.right="5vw",this.pos.top="4vh";break;default:this.pos.right="5vw",this.pos.bottom="4vh"}},moveTransition:function(){var t=document.getElementById(this.position+"-wrapper"),e=document.getElementById(this.position+"-action");"top-right"===this.position||"top-left"===this.position?t.appendChild(e):t.insertBefore(e,t.childNodes[0])},showTooltip:function(t){var e=this;t&&this.actions.length&&this.fixedTooltip&&setTimeout(function(){e.$refs.actions.forEach(function(t){e.toggle&&t._tooltip.show()})},700)}}},v={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{directives:[{name:"on-clickaway",rawName:"v-on-clickaway",value:t.away,expression:"away"}],staticClass:"fab-wrapper",style:[t.pos,{zIndex:t.zIndex},{position:t.positionType}],attrs:{id:t.position+"-wrapper"}},[i("div",{staticClass:"actions-container",style:t.listPos,attrs:{id:t.position+"-action"}},[i("transition",{attrs:{name:"fab-actions-appear","enter-active-class":t.transitionEnter,"leave-active-class":t.transitionLeave}},[i("ul",{directives:[{name:"show",rawName:"v-show",value:t.toggle,expression:"toggle"}],staticClass:"fab-list"},[t._l(t.actions,function(e){return[i("transition",{key:e.name,attrs:{"enter-active-class":"animated quick zoomIn","leave-active-class":"animated quick zoomOut"}},[e.tooltip?[t.toggle?i("li",{directives:[{name:"tooltip",rawName:"v-tooltip",value:{content:e.tooltip,placement:t.tooltipPosition,classes:"fab-tooltip",trigger:t.tooltipTrigger},expression:"{ content: action.tooltip, placement: tooltipPosition, classes: 'fab-tooltip', trigger: tooltipTrigger}"}],ref:"actions",refInFor:!0,staticClass:"pointer",style:{"background-color":e.color||t.bgColor},on:{click:function(i){t.toParent(e.name)}}},[i("i",{class:[t.actionIconSize,"material-icons"]},[t._v(t._s(e.icon))])]):t._e()]:[t.toggle?i("li",{staticClass:"pointer",style:{"background-color":e.color||t.bgColor},on:{click:function(i){t.toParent(e.name)}}},[i("i",{class:[t.actionIconSize,"material-icons"]},[t._v(t._s(e.icon))])]):t._e()]],2)]})],2)])],1),t._v(" "),t.rippleShow?[t.mainTooltip?[i("div",{directives:[{name:"ripple",rawName:"v-ripple",value:"light"==t.rippleColor?"rgba(255, 255, 255, 0.35)":"",expression:"rippleColor == 'light' ? 'rgba(255, 255, 255, 0.35)' : ''"},{name:"tooltip",rawName:"v-tooltip",value:{content:t.mainTooltip,placement:t.tooltipPosition,classes:"fab-tooltip"},expression:"{ content: mainTooltip, placement: tooltipPosition, classes: 'fab-tooltip' }"}],staticClass:"fab pointer",style:{"background-color":t.bgColor,padding:t.paddingAmount},on:{click:function(e){t.toggle=!t.toggle}}},[i("i",{class:[t.mainIconSize,{rotate:t.toggle},"material-icons main"]},[t._v(t._s(t.mainIcon))]),t._v(" "),i("i",{class:[t.mainIconSize,{rotate:t.toggle},"material-icons close"]},[t._v("add")])])]:[i("div",{directives:[{name:"ripple",rawName:"v-ripple",value:"light"==t.rippleColor?"rgba(255, 255, 255, 0.35)":"",expression:"rippleColor == 'light' ? 'rgba(255, 255, 255, 0.35)' : ''"}],staticClass:"fab pointer",style:{"background-color":t.bgColor,padding:t.paddingAmount},on:{click:function(e){t.toggle=!t.toggle}}},[i("i",{class:[t.mainIconSize,{rotate:t.toggle},"material-icons main"]},[t._v(t._s(t.mainIcon))]),t._v(" "),i("i",{class:[t.mainIconSize,{rotate:t.toggle},"material-icons close"]},[t._v("add")])])]]:[t.mainTooltip?[i("div",{staticClass:"fab pointer",style:{"background-color":t.bgColor,padding:t.paddingAmount},attrs:{"v-tooltip":{content:t.mainTooltip,placement:t.tooltipPosition,classes:"fab-tooltip"}}},[i("i",{staticClass:"material-icons md-36 main",class:{rotate:t.toggle}},[t._v(t._s(t.mainIcon))]),t._v(" "),i("i",{staticClass:"material-icons md-36 close",class:{rotate:t.toggle}},[t._v("add")])])]:[i("div",{staticClass:"fab pointer",style:{"background-color":t.bgColor,padding:t.paddingAmount}},[i("i",{staticClass:"material-icons md-36 main",class:{rotate:t.toggle}},[t._v(t._s(t.mainIcon))]),t._v(" "),i("i",{staticClass:"material-icons md-36 close",class:{rotate:t.toggle}},[t._v("add")])])]]],2)},staticRenderFns:[]};var g={tag:"",onTime:"",offTime:"",type:"lamp",portNum:0,loading:!1},h={name:"App",components:{fab:i("VU/8")(f,v,!1,function(t){i("EWot"),i("mCNe")},"data-v-66918f2a",null).exports},data:function(){return{editMode:!1,isCollapsed:!1,siderOpen:!0,fabOpen:!1,showTab:"all",formItem:g,fabItem:{bgColor:"#495060",position:"bottom-right",icon:"settings",fabActions:[{name:"restart",icon:"refresh"},{name:"powerOff",icon:"power_settings_new"}]},data:[{value:"active",label:"Start",disabled:!1},{value:"paused",label:"Pause",disabled:!1},{value:"stopped",label:"Stop",disabled:!1},{value:"restart",label:"Restart"},{value:"remove",label:"Remove"}]}},computed:l()({},Object(a.b)({selectedTimer:"getSelectedTimer",getSocketConnection:"getConnection"}),{preLoad:function(){return this.$store.getters.getPreLoad},groupedTimers:function(){var t=this.timers,e=t.filter(function(t){return"lamp"===t.timerType}),i=t.filter(function(t){return"fan"===t.timerType}),o=t.filter(function(t){return"pump"===t.timerType});return{all:m.a.chunk(t,4),lamp:m.a.chunk(e,4),fan:m.a.chunk(i,4),pump:m.a.chunk(o,4)}},timers:function(){return this.$store.getters.getTimers}}),mounted:function(){},methods:l()({},Object(a.c)({addTimerSubmit:"ADD_TIMER",editTimerSubmit:"EDIT_TIMER",selecTimer:"SET_SELECTED_TIMER",startTimer:"START_TIMER",restartTimer:"RESTART_TIMER",pauseTimer:"PAUSE_TIMER",stopTimer:"STOP_TIMER",deleteTimer:"DELETE_TIMER"}),{formatTime:function(t){var e=new Date(60*t*1e3),i=e.getUTCHours();i<10?i="0"+i:i.toString();var o=e.getUTCMinutes();o<10?o="0"+o:o.toString();var a=e.getUTCSeconds();return a<10?a="0"+a:a.toString(),i+":"+o},cardDoAction:function(t,e){var i=this.timers.find(function(t){return t._id===e});"restart"===t[0]?(this.restartTimer(i._id),this.$Notice.success({title:"Timer Restarted.",duration:2})):"remove"===t[0]?(this.deleteTimer(i._id),this.$Notice.success({title:"Timer removed.",duration:2})):"active"!==t[0]&&"paused"!==t[0]&&"stopped"!==t[0]||("active"===t[0]?this.startTimer(i._id):"paused"===t[0]?this.pauseTimer(i._id):"stopped"===t[0]&&this.stopTimer(i._id),this.$Notice.success({title:"Timer status changed.",duration:2}))},submitTimer:function(){var t=this,e=this.formItem;""===e.tag&&(e.tag="Timer");var i=new Date("Jan 1, 1970, "+e.onTime+" GMT+00:00"),o=new Date("Jan 1, 1970, "+e.offTime+" GMT+00:00"),a=i.getTime()/6e4,n=o.getTime()/6e4;e.tag.length&&a>0&&n>0&&e.type.length&&(e.loading=!0,this.addTimerSubmit({timerType:e.type,onTime:a,offTime:n,tag:e.tag,portNum:e.portNum}),e.tag="",e.onTime="",e.offTime="",e.type="lamp",e.portNum=0,setTimeout(function(){e.loading=!1,t.$Notice.success({title:"Timer Added successfully.",duration:2})},200))},restartServer:function(){this.$Notice.warning({title:"Restarting server.",duration:2})},powerOffServer:function(){this.$Notice.error({title:"Shutting down server.",duration:2})},handleTimerTab:function(t){this.showTab=t},handleSiderTab:function(t){g.tag="",g.onTime="",g.offTime="",g.type="lamp",g.portNum=0,"edit"===t?(this.editMode=!0,this.$Notice.open({title:"Select a timer for editing.",duration:2})):(this.selecTimer(""),this.editMode=!1)},fabChange:function(t){this.fabOpen=t},handleSiderCollapse:function(t){this.siderOpen=!t},handleCardClick:function(t){var e=this.timers.find(function(e){return e._id===t});this.editMode&&(this.selecTimer(e._id),g.tag=e.tag,g.onTime=this.formatTime(e.initialOnTime),g.offTime=this.formatTime(e.initialOffTime),g.type=e.timerType,g.portNum=e.portNum)},editTimer:function(){var t=this,e=this.timers.find(function(e){return e._id===t.selectedTimer}),i=new Date("Jan 1, 1970, "+this.formItem.onTime+" GMT+00:00"),o=new Date("Jan 1, 1970, "+this.formItem.offTime+" GMT+00:00"),a=i.getTime()/6e4,n=o.getTime()/6e4;this.editTimerSubmit({_id:e._id,status:"active",tag:this.formItem.tag,timerType:this.formItem.type,portNum:this.formItem.portNum,onTime:a,offTime:n}),this.$Notice.success({title:"Timer edited.",duration:2})}})},T={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"app"}},[i("transition",{attrs:{name:"fade"}},[t.preLoad?i("div",{attrs:{id:"pre-loader"}},[i("Spin",{attrs:{size:"large"}})],1):t._e()]),t._v(" "),i("div",{staticClass:"layout"},[i("Layout",[i("Header",[i("div",{staticClass:"layout-logo"}),t._v(" "),i("div",{staticClass:"layout-status"},[i("Row",[i("i-col",{attrs:{span:"8",offset:"8"}},[i("p",[i("Icon",{attrs:{type:"connection-bars"}}),t._v("Server: "+t._s(t.getSocketConnection?"online":"offline"))],1)]),t._v(" "),i("i-col",{attrs:{span:"8"}},[i("p",[i("Icon",{attrs:{type:"plus"}}),t._v("Total Timers: "+t._s(t.timers.length))],1)])],1)],1)]),t._v(" "),i("layout",{class:{"edit-mode":t.editMode}},[i("Sider",{attrs:{width:300,"collapsed-width":78,collapsible:""},on:{"on-collapse":t.handleSiderCollapse},model:{value:t.isCollapsed,callback:function(e){t.isCollapsed=e},expression:"isCollapsed"}},[i("div",{staticClass:"sider-tabs"},[i("Tabs",{attrs:{type:"card"},on:{"on-click":t.handleSiderTab}},[i("TabPane",{attrs:{name:"create",label:"Add",icon:"plus"}}),t._v(" "),i("TabPane",{attrs:{name:"edit",label:"Edit",icon:"edit"}})],1)],1),t._v(" "),i("div",{staticClass:"sider-content"},[i("Row",[i("transition",{attrs:{name:"sider-content-slide","enter-active-class":"animated slideInLeft","leave-active-class":"animated slideOutLeft"}},[i("i-col",{directives:[{name:"show",rawName:"v-show",value:t.siderOpen,expression:"siderOpen"}],attrs:{span:"24"}},[i("Row",[i("i-col",{attrs:{span:"20",offset:"2"}},[i("div",{staticClass:"title"},[t.editMode?t._e():i("p",[t._v("Add new timer")]),t._v(" "),t.editMode?i("p",[t._v("Edit timer")]):t._e()])])],1),t._v(" "),i("Row",[i("i-col",{attrs:{span:"20",offset:"2"}},[i("Form",[i("FormItem",{attrs:{label:"Tag"}},[i("Input",{staticStyle:{"max-width":"217px"},attrs:{icon:"pricetag",placeholder:"Enter tag..."},model:{value:t.formItem.tag,callback:function(e){t.$set(t.formItem,"tag",e)},expression:"formItem.tag"}})],1),t._v(" "),i("FormItem",{attrs:{label:""}},[i("TimePicker",{staticStyle:{width:"100%"},attrs:{type:"time",value:"ZZ",format:"HH:mm",placeholder:"On time ex. 00:00"},model:{value:t.formItem.onTime,callback:function(e){t.$set(t.formItem,"onTime",e)},expression:"formItem.onTime"}})],1),t._v(" "),i("FormItem",{attrs:{label:""}},[i("TimePicker",{staticStyle:{width:"100%"},attrs:{type:"time",value:"ZZ",format:"HH:mm",placeholder:"Off time ex. 00:00"},model:{value:t.formItem.offTime,callback:function(e){t.$set(t.formItem,"offTime",e)},expression:"formItem.offTime"}})],1),t._v(" "),i("FormItem",{attrs:{label:"Type"}},[i("RadioGroup",{model:{value:t.formItem.type,callback:function(e){t.$set(t.formItem,"type",e)},expression:"formItem.type"}},[i("Radio",{attrs:{label:"lamp"}},[t._v("Lamp")]),t._v(" "),i("Radio",{attrs:{label:"pump"}},[t._v("Pump")]),t._v(" "),i("Radio",{attrs:{label:"fan"}},[t._v("Fan")])],1)],1),t._v(" "),i("FormItem",{attrs:{label:"Port number"}},[i("InputNumber",{attrs:{max:10,min:1,step:1},model:{value:t.formItem.portNum,callback:function(e){t.$set(t.formItem,"portNum",e)},expression:"formItem.portNum"}})],1),t._v(" "),i("FormItem",[t.editMode?t._e():i("Button",{attrs:{loading:t.formItem.loading,type:"primary",long:""},on:{click:t.submitTimer}},[t.formItem.loading?i("span",[t._v("Loading...")]):i("span",[t._v("Add Timer")])]),t._v(" "),t.editMode?i("Button",{attrs:{loading:t.formItem.loading,type:"success",long:""},on:{click:t.editTimer}},[t.formItem.loading?i("span",[t._v("Loading...")]):i("span",[t._v("Submit")])]):t._e()],1),t._v(" "),i("FormItem",[i("Button",{attrs:{loading:t.formItem.loading,disabled:"",type:"primary",long:""},on:{click:t.submitTimer}},[t.formItem.loading?i("span",[t._v("Loading...")]):i("span",[t._v("Add Button\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"),i("icon",{attrs:{type:"information-circled"}})],1)])],1)],1)],1)],1)],1)],1),t._v(" "),i("transition",{attrs:{name:"sliderIconIn","enter-active-class":"animated slideInRight","leave-active-class":"animated slideOutRight"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:!t.siderOpen,expression:"!siderOpen"}],staticClass:"siderCollapsedMenu"},[i("Row",[i("i-col",{attrs:{span:"24"}},[i("p",{staticStyle:{transform:"rotate(90deg)"}},[t._v("OPEN")])])],1)],1)])],1)],1)]),t._v(" "),i("Content",{style:{padding:"10px 50px"}},[i("Tabs",{on:{"on-click":t.handleTimerTab}},[i("TabPane",{attrs:{disabled:t.editMode,name:"all",label:"All",icon:"asterisk"}}),t._v(" "),i("TabPane",{attrs:{disabled:t.editMode,name:"lamp",label:"Lamp",icon:"lightbulb"}}),t._v(" "),i("TabPane",{attrs:{disabled:t.editMode,name:"pump",label:"Pump",icon:"waterdrop"}}),t._v(" "),i("TabPane",{attrs:{disabled:t.editMode,name:"fan",label:"Fan",icon:"thermometer"}})],1),t._v(" "),i("div",{staticClass:"timer-container"},[i("transition",{attrs:{name:"fade"}}),t._v(" "),t._l(t.groupedTimers[t.showTab],function(e,o){return i("Row",{key:o,attrs:{gutter:16}},[i("transition-group",{attrs:{name:"fade",mode:"out-in"}},t._l(e,function(e,o){return"all"===t.showTab||t.showTab===e.timerType?i("i-col",{key:o,class:e.timerType,attrs:{xs:24,sm:24,md:12,lg:6}},[i("Card",{class:[e.status,{"edit-mode":t.editMode,selected:e._id===t.selectedTimer}],staticStyle:{width:"auto"},attrs:{bordered:!0,shadow:""},nativeOn:{click:function(i){t.handleCardClick(e._id)}}},[i("p",{staticStyle:{"line-height":"20px"},attrs:{slot:"title"},slot:"title"},["lamp"===e.timerType?i("icon",{attrs:{type:"lightbulb"}}):"pump"===e.timerType?i("icon",{attrs:{type:"waterdrop"}}):"fan"===e.timerType?i("icon",{attrs:{type:"thermometer"}}):t._e(),t._v("\n\t\t\t\t\t\t\t\t\t\t\t"+t._s(e.tag+"::"+e.portNum)+"\n\t\t\t\t\t\t\t\t\t\t\t"),i("Cascader",{key:e._id,attrs:{data:t.data},on:{"on-change":function(i){t.cardDoAction(i,e._id)}}},[i("Icon",{attrs:{type:"android-more-vertical"}})],1)],1),t._v(" "),i("Row",{staticStyle:{"min-width":"170px"}},[i("i-col",{staticStyle:{"text-align":"center"},attrs:{span:"8"}},[i("icon",{class:{active:!e.offTime&&"stopped"!=e.status&&!t.editMode},staticStyle:{cursor:"default"},attrs:{type:"android-time"}})],1),t._v(" "),i("i-col",{attrs:{span:"16"}},[i("Row",[i("i-col",{attrs:{span:"12"}},[i("p",{staticStyle:{"text-align":"right"}},[t._v("On Time:")])]),t._v(" "),i("i-col",{attrs:{span:"12"}},[t.editMode?t._e():i("p",{staticStyle:{"text-align":"left"}},[t._v(t._s(t.formatTime(e.onTime)))]),t._v(" "),t.editMode?i("p",{staticStyle:{"text-align":"left"}},[t._v(t._s(t.formatTime(e.initialOnTime)))]):t._e()])],1),t._v(" "),i("Row",[i("i-col",{attrs:{span:"12"}},[i("p",{staticStyle:{"text-align":"right"}},[t._v("Off Time:")])]),t._v(" "),i("i-col",{attrs:{span:"12"}},[t.editMode?t._e():i("p",{staticStyle:{"text-align":"left"}},[t._v(t._s(t.formatTime(e.offTime)))]),t._v(" "),t.editMode?i("p",{staticStyle:{"text-align":"left"}},[t._v(t._s(t.formatTime(e.initialOffTime)))]):t._e()])],1)],1)],1),t._v(" "),t.editMode?i("div",{staticClass:"cover"}):t._e()],1)],1):t._e()}))],1)})],2)],1),t._v(" "),i("fab",{class:{open:t.fabOpen},attrs:{disabled:t.editMode,"main-icon":t.fabItem.icon,position:t.fabItem.position,"bg-color":t.fabItem.bgColor,actions:t.fabItem.fabActions},on:{restart:t.restartServer,powerOff:t.powerOffServer,change:function(e){t.fabChange(e.val)}}})],1),t._v(" "),i("Footer",{staticClass:"layout-footer-center"},[t._v("2018 ©")])],1)],1)],1)},staticRenderFns:[]};var _=i("VU/8")(h,T,!1,function(t){i("KwC3")},null,null).exports,b=i("/ocq"),I={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"hello"},[i("h1",[t._v(t._s(t.msg))]),t._v(" "),i("h2",[t._v("Essential Links")]),t._v(" "),t._m(0),t._v(" "),i("h2",[t._v("Ecosystem")]),t._v(" "),t._m(1)])},staticRenderFns:[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("ul",[i("li",[i("a",{attrs:{href:"https://vuejs.org",target:"_blank"}},[t._v("\n\t\t\t\tCore Docs\n\t\t\t")])]),t._v(" "),i("li",[i("a",{attrs:{href:"https://forum.vuejs.org",target:"_blank"}},[t._v("\n\t\t\t\tForum\n\t\t\t")])]),t._v(" "),i("li",[i("a",{attrs:{href:"https://chat.vuejs.org",target:"_blank"}},[t._v("\n\t\t\t\tCommunity Chat\n\t\t\t")])]),t._v(" "),i("li",[i("a",{attrs:{href:"https://twitter.com/vuejs",target:"_blank"}},[t._v("\n\t\t\t\tTwitter\n\t\t\t")])]),t._v(" "),i("br"),t._v(" "),i("li",[i("a",{attrs:{href:"http://vuejs-templates.github.io/webpack/",target:"_blank"}},[t._v("\n\t\t\t\tDocs for This Template\n\t\t\t")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[e("a",{attrs:{href:"http://router.vuejs.org/",target:"_blank"}},[this._v("\n\t\t\t\tvue-router\n\t\t\t")])]),this._v(" "),e("li",[e("a",{attrs:{href:"http://vuex.vuejs.org/",target:"_blank"}},[this._v("\n\t\t\t\tvuex\n\t\t\t")])]),this._v(" "),e("li",[e("a",{attrs:{href:"http://vue-loader.vuejs.org/",target:"_blank"}},[this._v("\n\t\t\t\tvue-loader\n\t\t\t")])]),this._v(" "),e("li",[e("a",{attrs:{href:"https://github.com/vuejs/awesome-vue",target:"_blank"}},[this._v("\n\t\t\t\tawesome-vue\n\t\t\t")])])])}]};var w=i("VU/8")({name:"HelloWorld",data:function(){return{msg:"Welcome to Your Vue.js App"}}},I,!1,function(t){i("OgWO")},"data-v-53fec104",null).exports;o.default.use(b.a);var y=new b.a({routes:[{path:"/",name:"HelloWorld",component:w}]}),S=i("DmT9"),C=i.n(S);i("+skl"),i("0KfL"),i("9Q9G");o.default.use(a.a),o.default.use(s.a),o.default.config.productionTip=!0;var E=C.a.connect("http://localhost:3000/",{reconnect:!0}),k=new a.a.Store({state:{preLoad:!1,socketConnected:!1,timers:[],selectedTimer:""},getters:{getConnection:function(t){return t.socketConnected},getTimers:function(t){return t.timers},getPreLoad:function(t){return t.preLoad},getSelectedTimer:function(t){return t.selectedTimer}},mutations:{SET_CONNECTION:function(t,e){t.socketConnected=e},GET_TIMERS:function(t,e){E.emit("update timers")},SET_TIMERS:function(t,e){t.timers=e},ADD_TIMER:function(t,e){E.emit("add timer",{timerType:e.timerType,onTime:e.onTime,offTime:e.offTime,tag:e.tag,portNum:e.portNum})},EDIT_TIMER:function(t,e){E.emit("edit timer",{id:e._id,patch:e})},RESTART_TIMER:function(t,e){E.emit("restart timer",{id:e})},START_TIMER:function(t,e){E.emit("start timer",{id:e})},PAUSE_TIMER:function(t,e){E.emit("pause timer",{id:e})},STOP_TIMER:function(t,e){E.emit("stop timer",{id:e})},DELETE_TIMER:function(t,e){E.emit("delete timer",{id:e})},SERVER_RESTART:function(){E.emit("restart")},SERVER_POWEROFF:function(){E.emit("power off")},SET_SELECTED_TIMER:function(t,e){return t.selectedTimer=e}},actions:{}});new o.default({el:"#app",router:y,store:k,components:{App:_},created:function(){},mounted:function(){var t=this;setInterval(function(){t.$store.commit("GET_TIMERS")},1e3)},methods:{timerTick:function(){},refreshTimers:function(){}},template:"<App/>"}),E.on("connect",function(){console.log("Connected!"),k.commit("SET_CONNECTION",!0)}),E.on("timers",function(t){k.commit("SET_TIMERS",t)}),E.on("tick",function(){}),E.on("disconnect",function(){console.log("disconnected"),k.commit("SET_CONNECTION",!1)})},OgWO:function(t,e){},mCNe:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.abe14abed75e33b74b71.js.map