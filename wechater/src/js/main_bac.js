/*!
 * vue-common.js
 */
 $.fn.scrollSmooth = function(scrollHeight, duration) {
	var $el = this;
	var el  = $el[0];
	var startPosition = el.scrollTop;
	var delta = scrollHeight  - startPosition;
	var startTime = Date.now();
	function scroll() {
		var fraction = Math.min(1, (Date.now() - startTime) / duration);
		el.scrollTop = delta * fraction + startPosition;
		if(fraction < 1) {
			setTimeout(scroll, 10);
		}
	}
	scroll();
};
var templates = {
	loadingPage: '<div id="loadingPage" v-on:animationend="animateEnd" class="loading-page animated" v-bind:class="{fadeOut: fadeout}" v-show="show">\
		<div class="flex-hv-center h100">\
			<div class="loading">\
				<div class="logo"><img class="block" src="src/images/logo.png" /></div>\
				<div class="loading-bar">\
					<div class="loading-line" :style="{width: pPercent}"></div>\
				</div>\
			</div>\
		</div>\
	</div>',
	messageView: '<div class="message-view">\
		<div class="message-os" v-show="activeOs" v-bind:class="{\'animated fadeIn fast\': animate}" v-on:animationend.self="animateEnd">\
			<div class="flex-hv-center">\
				<div class="wrap-img"><img v-bind:src="activeOs" /></div>\
			</div>\
		</div>\
		<div class="messages">\
			<div class="messages-inner">\
				<fall-emoji :p-count="count"></fall-emoji>\
				<div class="wrap-messages" ref="wrapMessages" id="wrapMessages">\
					<div class="wrap-messages-inner" ref="wrapMessagesInner" id="wrapMessagesInner">\
						<div class="message animated fast slideInUp" v-for="(el,key) in pMessages">\
							<div class="message-inner flex" v-bind:class="{\'flex-s-right\': el.right}">\
								<div class="avatar"><img :src="el.avatarpic" /></div>\
								<div class="content">\
									<div class="bubble" v-bind:class="{bubble_image: el.pic}">\
										<div class="bubble_cont">\
											<div class="plain" v-if="el.text">\
												<pre>{{el.text}}</pre>\
											</div>\
											<div class="picture" v-if="el.pic">\
												<img v-bind:src="el.pic" />\
											</div>\
										</div>\
									</div>\
								</div>\
							</div>\
						</div>\
					</div>\
				</div>\
			</div>\
		</div>\
		<div class="message-enter">\
			<div class="board-top flex">\
				<div class="input-enter icon-input flex-v-center">\
					<p class="flex-h-right">{{nextEnterMsg}}</p>\
					<span class="line-flash animated infinite slow flash"></span>\
				</div>\
			</div>\
			<div class="board-key">\
				<div class="btn icon-send flex-hv-center" v-bind:class="{active: sendBtnActive}">发送</div>\
			</div>\
		</div>\
	</div>'
}

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
			console.log(this.pPercent)
			return Number(this.pPercent.replace('%','')) >= 100;
		}
	}
});

var fallEmoji = Vue.extend({
	template: '<div class="fall-view" v-show="emojis" v-on:animationend="animateEnd">\
		<span v-for="(el,key) in emojis" v-bind:style="el" class="fallDown animated"><img src="src/images/emoji.png"></span>\
	</div>',
	data: function(){
		return {
			finish: 0,
			emojis: null
		}
	},
	props: ['pCount'],
	watch:{
		pCount: function(a){
			var arr = [];
			for(var i=0; i<this.pCount; i++){
				var styleObj = {
					left: parseInt(Math.random()*77+10)+'%',
					top: parseInt(Math.random()*5)+'%',
					'animation-duration': (Math.random()*3+2).toFixed(3)+'s',
					'animation-delay': (Math.random()*3).toFixed(3)+'s',
					'animation-name': 'fallDown'+parseInt(Math.random()*3+1)
				}
				arr.push(styleObj)
			}
			this.emojis = arr;
		}
	},
	methods: {
		animateEnd: function(e){
			var self = this;
			this.finish++;
			if(this.finish === this.pCount){
				console.log(1)
				this.$parent.pViewstep = 1;
			}
		}
	}
});

var messageView = Vue.extend({
	template: templates.messageView,
	data: function(){
		return {
			nextEnterMsg: '新年快乐啊新年快乐啊新年快乐啊新年快乐啊新年快乐啊!',
			sendBtnActive: false,
			activeOs: null,
			animate: false,
			count: null
		}
	},
	props: ['pMessages','pViewstep'],
	components: {
		'fall-emoji': fallEmoji
	},
	watch: {
		pMessages: {
			handler: function(a,b){
				var self = this;
				this.$nextTick(function(){
					var contentH = $(self.$refs.wrapMessagesInner).height();
					var viewH = $(self.$refs.wrapMessages).height();
					console.log(contentH,viewH)
					$(self.$refs.wrapMessages).scrollSmooth(contentH - viewH + 16, 300)
				});
			},
			deep: true
		},
		pViewstep: {
			handler: function(a,b){
				this.$parent.viewstep = 1;
			},
			deep: true
		},
	},
	methods: {
		showOs: function(str){
			var self = this;
			setTimeout(function(){
				self.activeOs = str || 'src/images/os_1.png';
				self.animate = true;
				setTimeout(function(){
					self.activeOs = null;
					self.count = 15;
					console.log(self)
				},1000);
			},1000)
		},
		send: function(e){
			var self = this;
			this.sendBtnActive = true;
			setTimeout(function(){
				self.pMessages.push({
					right: true,
					text: self.nextEnterMsg,
					avatarpic: 'src/images/logo.png',
				})
				self.nextEnterMsg = null;
				self.sendBtnActive = false;
				self.showOs()
				// setTimeout(function(){
				// 	self.$parent.show = 1;
				// 	self.$parent.animated = 1;
				// },2000)
			},100)
		},
		animateEnd: function(e){
			this.animate = false;
		}
	},
	mounted: function(){
		var self = this;
		setTimeout(function(){
			self.send();
		},1000)
	}
});

var indexApp = new Vue({
	el: '#app',
	data : function(){
		return {
			step: 0,
			percent: 0,
			viewstep: 0,
			messages1: [
				{
					text: '爸爸妈妈新年快乐',
					avatarpic: 'src/images/logo.png',
				},
				{
					right: true,
					text: '新年快乐啊',
					avatarpic: 'src/images/logo.png',
				},
				{
					text: '爸爸妈妈新年快乐1',
					avatarpic: 'src/images/logo.png',
				},
				{
					right: true,
					text: '新年快乐啊1',
					avatarpic: 'src/images/logo.png',
				},
				{
					right: true,
					text: '新年快乐啊2',
					avatarpic: 'src/images/logo.png',
				},
				{
					right: true,
					pic: 'src/images/logo.png',
					avatarpic: 'src/images/logo.png',
				}
			],
			messages2: [
				{
					text: '爸爸妈妈新年快乐',
					avatarpic: 'src/images/logo.png',
				},
				{
					right: true,
					text: '新年快乐啊',
					avatarpic: 'src/images/logo.png',
				},
				{
					text: '爸爸妈妈新年快乐1',
					avatarpic: 'src/images/logo.png',
				},
				{
					right: true,
					text: '新年快乐啊1',
					avatarpic: 'src/images/logo.png',
				},
				{
					right: true,
					text: '新年快乐啊2',
					avatarpic: 'src/images/logo.png',
				}
			],
			animate: 0,
			show: 0
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
		'message-view': messageView,
		'loading-page': loadingPage
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
		},
		animateEnd: function(){
			this.animate = null;
			console.log(this)
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