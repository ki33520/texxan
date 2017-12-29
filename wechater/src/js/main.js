/*!
 * vue-common.js
 */
var templates = {
	bubble: '<div class="bubbles">\
		<div class="bubble" v-for="(el,key) in pBubbles">\
			<div class="bubble-inner flex" v-if="!el.right">\
				<div class="avatar"><img :src="el.avatarpic" /></div>\
				<div class="content">\
					<div class="msg">{{el.msg}}</div>\
				</div>\
			</div>\
			<div class="bubble-inner flex-h-right" v-if="el.right">\
				<div class="content">\
					<div class="msg">{{el.msg}}</div>\
				</div>\
				<div class="avatar"><img :src="el.avatarpic" /></div>\
			</div>\
		</div>\
	</div>',
	loadingPage: '<div id="loadingPage" v-on:animationend="animateEnd" class="loading-page animated" v-bind:class="{fadeOut: fadeout}" v-show="show">\
		<div class="flex-hv-center h100">\
			<div class="loading">\
				<div class="logo"><img class="block" src="src/images/logo.png" /></div>\
				<div class="loading-bar">\
					<div class="loading-line" :style="{width: pPercent}"></div>\
				</div>\
			</div>\
		</div>\
	</div>'
}
var bubble = Vue.extend({
	template: templates.bubble,
	data: function(){
		return {
			
		}
	},
	props: ['pBubbles'],
	methods: {
		
	}
});

var loadingPage = Vue.extend({
	template: templates.loadingPage,
	data: function(){
		return {
			show: true
		}
	},
	props: ['pPercent'],
	methods: {
		animateEnd: function(e){
			this.show = false;
		}
	},
	computed: {
		fadeout: function(){
			return Number(this.pPercent.replace('%','')) >= 100;
		}
	}
});

var indexApp = new Vue({
	el: '#app',
	data : function(){
		return {
			bubbles: [
				{
					msg: '爸爸妈妈新年快乐',
					avatarpic: 'src/images/logo.png',
				},
				{
					right: true,
					msg: '新年快乐啊',
					avatarpic: 'src/images/logo.png',
				},
				{
					msg: '爸爸妈妈新年快乐1',
					avatarpic: 'src/images/logo.png',
				},
				{
					right: true,
					msg: '新年快乐啊1',
					avatarpic: 'src/images/logo.png',
				},
				{
					right: true,
					msg: '新年快乐啊2',
					avatarpic: 'src/images/logo.png',
				},
				{
					right: true,
					msg: '新年快乐啊3',
					avatarpic: 'src/images/logo.png',
				}
			],
			percent: 0,
			step: 0,
		}
	},
	watch: {
		step: {
			handler: function(a,b){
				console.log(a,b)
			},
			deep: true
		}
	},
	components: {
		'bubble-item': bubble,
		'loading-page': loadingPage,
	},
	methods: {
		viewStart: function(){
			var self = this;
		},
		loading: function(){
			var self = this;
			//setTimeout(function(){
				self.percent++;
				if(self.percent < 100){
					self.loading()
				}else{
					self.viewStart()
					self.step = 1;
				}
			//},1)
		}
	},
	computed: {
		percentStr: function(){
			return this.percent + '%';
		}
	},
	mounted: function(){
		this.loading();
	}
});