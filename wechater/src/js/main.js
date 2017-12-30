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
	message: '<div class="messages">\
		<div class="wrap-messages" ref="wrapMessages" id="wrapMessages">\
			<div class="wrap-messages-inner" ref="wrapMessagesInner" id="wrapMessagesInner">\
				<div class="message animated fast slideInUp" v-for="(el,key) in pMessages">\
					<div class="message-inner flex" v-if="!el.right">\
						<div class="avatar"><img :src="el.avatarpic" /></div>\
						<div class="content">\
							<div class="bubble">\
								<div class="bubble_cont">\
									<div class="plain">\
										<pre>{{el.msg}}</pre>\
									</div>\
								</div>\
							</div>\
						</div>\
					</div>\
					<div class="message-inner flex-h-right" v-if="el.right">\
						<div class="content">\
							<div class="bubble">\
								<div class="bubble_cont">\
									<div class="plain">\
										<pre>{{el.msg}}</pre>\
									</div>\
								</div>\
							</div>\
						</div>\
						<div class="avatar"><img :src="el.avatarpic" /></div>\
					</div>\
				</div>\
			</div>\
		</div>\
	</div>',
	messageEnter: '<div class="board-enter">\
		<div class="board-top flex">\
			<div class="input-enter icon-input flex-v-center">\
				<p class="flex-h-right">{{nextEnterMsg}}</p>\
				<span class="line-flash animated infinite slow flash"></span>\
			</div>\
		</div>\
		<div class="board-key">\
			<div class="btn icon-send flex-hv-center" v-bind:class="{active: sendBtnActive}" @keydown="send">发送</div>\
		</div>\
	</div>',
	messageView: '<div class="message-view">\
		<div class="messages">\
			<div class="wrap-messages" ref="wrapMessages" id="wrapMessages">\
				<div class="wrap-messages-inner" ref="wrapMessagesInner" id="wrapMessagesInner">\
					<div class="message animated fast slideInUp" v-for="(el,key) in pMessages">\
						<div class="message-inner flex" v-if="!el.right">\
							<div class="avatar"><img :src="el.avatarpic" /></div>\
							<div class="content">\
								<div class="bubble">\
									<div class="bubble_cont">\
										<div class="plain">\
											<pre>{{el.msg}}</pre>\
										</div>\
									</div>\
								</div>\
							</div>\
						</div>\
						<div class="message-inner flex-h-right" v-if="el.right">\
							<div class="content">\
								<div class="bubble">\
									<div class="bubble_cont">\
										<div class="plain">\
											<pre>{{el.msg}}</pre>\
										</div>\
									</div>\
								</div>\
							</div>\
							<div class="avatar"><img :src="el.avatarpic" /></div>\
						</div>\
					</div>\
				</div>\
			</div>\
		</div>\
		<div class="board-enter">\
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
			return Number(this.pPercent.replace('%','')) >= 100;
		}
	}
});

var message = Vue.extend({
	template: templates.message,
	data: function(){
		return {
			
		}
	},
	props: ['pMessages'],
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
		}
	},
	methods: {
		
	}
});

var messageEnter = Vue.extend({
	template: templates.messageEnter,
	data: function(){
		return {
			nextEnterMsg: '新年快乐啊新年快乐啊新年快乐啊新年快乐啊新年快乐啊!',
			sendBtnActive: false
		}
	},
	props: ['pMessages'],
	methods: {
		showOs: function(){
			setTimeout(function(){

			},1000)
		},
		send: function(e){
			var self = this;
			this.sendBtnActive = true;
			setTimeout(function(){
				self.pMessages.push({
					right: true,
					msg: self.nextEnterMsg,
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
		}
	},
	mounted: function(){
		var self = this;
		setTimeout(function(){
			self.send();
		},1000)
	}
})

var messageView = Vue.extend({
	template: templates.messageView,
	data: function(){
		return {
			nextEnterMsg: '新年快乐啊新年快乐啊新年快乐啊新年快乐啊新年快乐啊!',
			sendBtnActive: false
		}
	},
	props: ['pMessages'],
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
		}
	},
	methods: {
		showOs: function(){
			setTimeout(function(){

			},1000)
		},
		send: function(e){
			var self = this;
			this.sendBtnActive = true;
			setTimeout(function(){
				self.pMessages.push({
					right: true,
					msg: self.nextEnterMsg,
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
		}
	},
	mounted: function(){
		var self = this;
		setTimeout(function(){
			self.send();
		},1000)
	}
})

var indexApp = new Vue({
	el: '#app',
	data : function(){
		return {
			step: 0,
			percent: 0,
			messages1: [
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
				}
			],
			messages2: [
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
		'message-item': message,
		'loading-page': loadingPage,
		'message-enter': messageEnter
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