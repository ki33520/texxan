/*!
 * vue-common.js
 */

var templates = {
	loadingPage: '<div id="loadingPage" class="loading-page fast animated" :class="{fadeOut: pLoading.done}" v-show="!pLoading.done" @click="start">\
		<div class="flex-hv-center h100">\
			<div class="loading">\
				<div class="logo" :class="{hidden: loaded}"><img class="block" src="src/images/logo.png" /></div>\
				<div class="loading-bar" :class="{hidden: loaded}">\
					<div class="loading-line" :style="{width: pLoading.percent+\'\%\'}"></div>\
				</div>\
				<div class="flex-hv-center">\
					<div class="btn btn-loaded flex-hv-center" v-show="loaded">点击屏幕开始</div>\
				</div>\
			</div>\
			<div class="text">\
				<div class="wrap-img"><img src="src/images/loading_text.png" /></div>\
			</div>\
		</div>\
	</div>',
	messageView: '<div class="message-view" >\
		<div class="view-item" @click="skipFn(el,key)" :class="styles(el,key)" v-show="pMessage.steps[0] === key" v-for="(el,key) in pMessage.items">\
			<div class="pops">\
				<div class="animated" @animationend="animateEnd" :class="styles(item,key,index)" v-show="showFn(key,index)" v-for="(item,index) in el.nodes">\
					<div class="wrap-img"><img class="block" :src="\'src/images/\'+item.pop" /></div>\
				</div>\
			</div>\
			<div class="bg" :class="el.classes">\
				<div class="wrap-img"><img class="block" :src="\'src/images/\'+el.bg" /></div>\
			</div>\
		</div>\
	</div>'
}
// :36 :class="{fadeIn: pLoading.done}"
// <div style="position: absolute; left: 0; top: 0; z-index: 100">{{pMessage.steps}}</div>\

var loadingPage = Vue.extend({
	template: templates.loadingPage,
	props: ['pLoading'],
	data: function(){
		return {
			imgCount: 40,
			loaded: false
		}
	},
	methods: {
		loading: function(){
			var self = this;
		},
		start: function(){
			if(this.loaded){
				this.pLoading.done = true;
			}
			jQuery('audio').load();
		}
	},
	mounted: function(){
		var self = this;
		//this.loading();
		jQuery('#app').imagesLoaded(function(e){
			self.loaded = true;
			//self.pLoading.percent = 100;

		}).progress(function(instance, image){
			self.pLoading.percent = parseInt(instance.progressedCount / self.imgCount * 100);
		});
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
				var activeNode = this.pMessage.items[a[0]] && this.pMessage.items[a[0]].nodes[a[1]];
				if(activeNode && activeNode.audio){
					jQuery('#'+activeNode.audio)[0].play();
				}
				if(a[0] === 0 && a[1] === 2){
					//this.pause();
					console.log(a)
				}
			},
			deep: true
		}
	},
	props: ['pMessage','pLoading'],
	methods: {
		skipFn: function(el,key){
			if(el.skip){
				this.pMessage.steps = [key+1,0];
				jQuery('audio').each(function(){
					jQuery(this)[0].pause();
				})
			}
		},
		showFn: function(key,index){
			var self = this;
			var node = self.pMessage.items[key].nodes[index]
			var nextNode = self.pMessage.items[key].nodes[index+1];
			var a = self.pMessage.steps[0];
			var b = self.pMessage.steps[1];
			if(node.stay && a === key && index < b){
				//alert(b+'---'+index+'---'+node.stay)
				if(index+node.stay >= b){
					return true;
				}else{
					return false;
				}
			}else{
				return a === key && b === index;
			}
		},
		styles: function(item,key,index){
			var obj = {};
			obj[item.animateType] = item.animateType;
			var speed = item.speed || 'quickly';
			obj[speed] = true;
			if(item.pop){
				obj['pop'] = true;
				obj['pop-'+index] = true;
				obj[item.classes] = item.classes;
			}else{
				obj['view-item-'+key] = true;
			}
			
			return obj;
		},
		next: function(){
			var self = this;
			console.log(self.pMessage.steps)
			if(this.playing === true){
				var a = self.pMessage.steps[0];
				var b = self.pMessage.steps[1];
				b++;
				if(self.pMessage.items[a].nodes[b]){
					self.pMessage.steps = [a,b];
				}else{
					a++;
					b = 0;
					if(self.pMessage.items[a]){
						self.pMessage.steps = [a,b];
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
				var audio = self.pMessage.items[a].nodes[b].audio;
				if(audio){
					// jQuery('#'+audio).on('ended',function(){
					// 	self.next();
					// });
					setTimeout(function(){
						self.next();
					},3000)
				}else{
					self.next();
				}
				
			},delay);
		},
		start: function(){
			this.pMessage.steps = [5,0];
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
						speed: 'fast',
						nodes: [
							{
								pop: 'pop_1_1.png',
								delay: 2,
								animateType: 'fadeInDown'
							}
						]
					},
					{
						view: 1,
						bg: 'bg_2.jpg',
						speed: 'fast',
						nodes: [
							{
								pop: 'pop_2_1.png',
								delay: 2,
								animateType: 'zoomInD'
							},
							{
								pop: 'pop_2_2.png',
								delay: 2,
								animateType: 'zoomInLD'
							},
							{
								pop: 'pop_2_3.png',
								delay: 2,
								animateType: 'zoomInD'
							},
							{
								pop: 'pop_2_4.png',
								delay: 2,
								animateType: 'zoomInLD'
							},
							{
								pop: 'pop_2_5.png',
								delay: 2,
								stay: 1,
								animateType: 'zoomInRD'
							},
							{
								classes: 'os flex-hv-center',
								pop: 'os_2_1.png',
								delay: 3,
								animateType: 'fadeIn'
							},
							{
								pop: 'pop_2_6.png',
								delay: 2,
								stay: 1,
								animateType: 'zoomInRD'
							},
							{
								classes: 'os flex-hv-center',
								pop: 'os_2_2.png',
								delay: 3,
								animateType: 'fadeIn'
							},
							{
								pop: 'pop_2_7.png',
								delay: 2,
								animateType: 'zoomInLD'
							},
							{
								pop: 'pop_2_8.png',
								delay: 2,
								animateType: 'zoomInRD'
							},
							{
								pop: 'pop_2_9.png',
								delay: 2,
								animateType: 'zoomInD'
							},
							{
								classes: 'os black flex-hv-center',
								pop: 'os_2_3.png',
								delay: 2,
								animateType: 'fadeIn'
							}
						]
					},
					{
						view: 2,
						bg: 'bg_3.jpg',
						speed: 'fast',
						nodes: [
							{
								pop: 'pop_3_1.png',
								delay: 2,
								animateType: 'zoomInLD'
							},
							{
								pop: 'pop_3_2.png',
								delay: 2,
								stay: 1,
								animateType: 'zoomInRD'
							},
							{
								classes: 'os space flex-h-center',
								pop: 'os_3_1.png',
								delay: 2,
								stay: 1,
								animateType: 'slideInDown'
							},
							{
								classes: 'os flex-hv-center',
								pop: 'os_3_2.png',
								delay: 3,
								animateType: 'fadeIn'
							},
							{
								classes: 'os black flex-hv-center',
								pop: 'os_3_3.png',
								delay: 2,
								animateType: 'fadeIn'
							}
						]
					},
					{
						view: 3,
						bg: 'bg_4.jpg',
						speed: 'fast',
						nodes: [
							{
								pop: 'pop_4_1.png',
								delay: 2,
								animateType: 'zoomInD'
							},
							{
								pop: 'pop_4_2.png',
								delay: 2,
								animateType: 'zoomInRT'
							},
							{
								pop: 'pop_4_3.png',
								delay: 2,
								animateType: 'zoomInRT'
							},
							{
								pop: 'pop_4_4.png',
								delay: 2,
								animateType: 'zoomInRT'
							},
							{
								classes: 'os flex-h-center',
								pop: 'os_4_1.png',
								delay: 3,
								animateType: 'fadeInDown'
							},
							{
								classes: 'os black flex-hv-center',
								pop: 'os_4_2.png',
								delay: 2,
								animateType: 'fadeIn'
							}
						]
					},
					{
						view: 4,
						bg: 'bg_3.jpg',
						speed: 'fast',
						nodes: [
							{
								pop: 'pop_5_1.png',
								delay: 2,
								animateType: 'zoomInLD'
							},
							{
								pop: 'pop_5_2.png',
								delay: 2,
								animateType: 'zoomInRD'
							},
							{
								pop: 'pop_5_3.png',
								delay: 2,
								animateType: 'zoomInLD'
							},
							{
								pop: 'pop_5_4.png',
								delay: 2,
								stay: 1,
								animateType: 'zoomInRD'
							},
							{
								classes: 'os flex-hv-center',
								pop: 'os_5_1.png',
								delay: 3,
								animateType: 'fadeIn'
							},
							{
								classes: 'os space flex-h-center',
								pop: 'os_5_2.png',
								delay: 2,
								animateType: 'slideInDown'
							}
						]
					},
					{
						view: 4,
						bg: 'bg_6.png',
						speed: 'fast',
						skip: true,
						nodes: [
							{
								pop: 'pop_6_1.png',
								delay: 2,
								audio: 'audio-1',
								animateType: 'zoomInD'
							}
						]
					},
					{
						view: 5,
						classes: 'flex flex-v-bottom',
						bg: 'bg_7.jpg',
						speed: 'fast',
						nodes: [
							{
								pop: 'pop_7_1.png',
								delay: 1,
								stay: 3,
								animateType: 'fadeInRight'
							},
							{
								pop: 'pop_7_2.png',
								delay: 2,
								stay: 2,
								animateType: 'fadeInLeft'
							},
							{
								pop: 'pop_7_3.png',
								delay: 1,
								stay: 1,
								animateType: 'fadeInRight'
							},
							{
								pop: 'pop_7_4.png',
								delay: 2,
								animateType: 'fadeInLeft'
							}
						]
					},
					{
						view: 5,
						bg: 'bg_8.png',
						speed: 'fast',
						nodes: [
							{
								pop: 'pop_8_1.png',
								delay: 2,
								audio: 'audio-2',
								animateType: 'zoomInD'
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
	created: function(){
		jQuery('audio').load();
	},
	mounted: function(){
		var h = parseInt(jQuery(this.$el).width() * 2017 / 1242);
		jQuery(this.$el).css({height:h});
	}
});

