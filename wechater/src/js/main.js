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
	loadingPage: '<div id="loadingPage" @animationend="animateEnd" class="loading-page fast animated" :class="{fadeOut: this.pLoading.percent >= 100}" v-show="!pLoading.done">\
		<div class="flex-hv-center h100">\
			<div class="loading">\
				<div class="logo"><img class="block" src="src/images/logo.png" /></div>\
				<div class="loading-bar">\
					<div class="loading-line" :style="{width: pLoading.percent+\'\%\'}"></div>\
				</div>\
			</div>\
		</div>\
	</div>',
	messageView: '<div class="message-view animated" :class="{fadeIn: pLoading.percent >= 100}">\
		<div style="position: absolute; left: 0; top: 0; z-index: 100">{{pMessage.steps}}</div>\
		<div class="view-item animated" :class="styles(el,key)" v-show="pMessage.steps[0] === key" v-for="(el,key) in pMessage.items" @click="play">\
			<div class="pops">\
				<div class="animated"  @animationend="animateEnd" :class="styles(item,index)" v-show="pMessage.steps[0] === key && pMessage.steps[1] === index" v-for="(item,index) in el.nodes" :style="{left: item.left, top: item.top}">\
					<div class="wrap-img"><img class="block" :src="\'src/images/\'+item.pop" /></div>\
				</div>\
			</div>\
			<div class="bg">\
				<div class="wrap-img"><img class="block" :src="\'src/images/\'+el.bg" /></div>\
			</div>\
		</div>\
	</div>'
}

var loadingPage = Vue.extend({
	template: templates.loadingPage,
	props: ['pLoading'],
	methods: {
		loading: function(){
			var self = this;
			setTimeout(function(){
				self.pLoading.percent++;
				if(self.pLoading.percent < 100){
					self.loading();
				}else{
					setTimeout(function(){
						if(!self.pLoading.done){
							self.pLoading.done = true;
						}
					},2000);
				}
			},1)
		},
		animateEnd: function(e){
			console.log('loading hide')
			this.pLoading.done = true;
		}
	},
	mounted: function(){
		this.loading();
	}
});

var messageView = Vue.extend({
	template: templates.messageView,
	data: function(){
		return {
			playing: false,
			stop: false
		}
	},
	watch: {
		'pLoading.done': {
			handler: function(a,b){
				this.playing = a;
				this.start();
			},
			deep: true
		},
		'pMessage.steps': {
			handler: function(a,b){
				if(a[0] === 0 && a[1] === 2){
					//this.pause();
				}
			},
			deep: true
		}
	},
	props: ['pMessage','pLoading'],
	methods: {
		styles: function(item,index){
			var obj = {};
			obj[item.animateType] = item.animateType;
			obj[item.speed] = item.speed;
			if(item.pop){
				obj['pop'] = true;
				obj['pop-'+index] = true;
				if(item.type === 2){
					obj['os'] = true;
				}
			}else{
				obj['view-item-'+index] = true;
			}
			return obj;
		},
		next: function(){
			var self = this;
			//console.log(self.pMessage.steps)
			if(this.playing === true){
				var a = self.pMessage.steps[0];
				var b = self.pMessage.steps[1];
				b++;
				if(self.pMessage.items[a].nodes[b]){
					self.pMessage.steps = [a,b];
				}else{
					a++;
					if(self.pMessage.items[a]){
						self.pMessage.steps = [a,0];
					}else{
						self.playing = false;
						self.stop = true;
					}
				}
			}
		},
		pause: function(){
			this.playing = false;
		},
		play: function(){
			this.playing = true;
			this.next();
		},
		animateEnd: function(e){
			var self = this;
			var a = self.pMessage.steps[0];
			var b = self.pMessage.steps[1];
			var delay = self.pMessage.items[a].nodes[b].delay*1000 || 500;
			setTimeout(function(){
				self.next();
			},delay)
		},
		start: function(){
			this.pMessage.steps = [0,0];
		}
	},
	mounted: function(){
		var self = this;
		//this.pMessage.type = 1;
	}
});

var indexApp = new Vue({
	el: '#app',
	data : function(){
		return {
			loadingObj: {
				done: false,
				percent: 0
			},
			messageObj: {
				steps: new Array(2),
				items: [
					{
						view: 0,
						bg: 'bg_1.jpg',
						animateType: 'fadeIn',
						speed: 'fast',
						nodes: [
							{
								pop: 'pop_1_1.png',
								left: "10%",
								top: "10%",
								animateType: 'zoomIn'
							},
							{
								pop: 'pop_1_2.png',
								left: "50%",
								top: "40%",
								animateType: 'jackInTheBox'
							},
							{
								type: 2,
								pop: 'os_1.png',
								animateType: 'fadeIn',
								speed: 'fast',
								delay: 2
							}
						]
					},
					{
						view: 1,
						bg: 'bg_2.jpg',
						animateType: 'fadeIn',
						speed: 'fast',
						nodes: [
							{
								pop: 'pop_2_1.png',
								left: "10%",
								top: "10%",
								animateType: 'jackInTheBox'
							},
							{
								pop: 'pop_2_2.png',
								left: "50%",
								top: "40%",
								animateType: 'fadeIn'
							}
						]
					}
				]
			}
		}
	},
	watch: {
		messageObj: {
			handler: function(a,b){
				//console.log(a,b)
			},
			deep: true
		},
		type: {
			handler: function(a,b){
				//this.$nextTick(function(){
					console.log(a,b)
				//});
			},
			deep: true
		}
	},
	components: {
		'message-view': messageView,
		'loading-page': loadingPage
	},
	methods: {
		animateEnd: function(){
			console.log(this)
		}
	},
	mounted: function(){
		
	}
});