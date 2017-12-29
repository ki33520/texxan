/*vue component*/
var templates = {
	popBox: 
		'<div class="pop-warning flex" ref="popBox">\
			<div class="pop-warning-inner ">\
				<ul>\
					<li v-for="item in list">{{item}}</li>\
				</ul>\
			</div>\
		</div>',
	popConfirmBox:
		'<div class="pop-warning pop-confirm flex">\
			<div class="pop-warning-inner ">\
				<div class="top">提示</div>\
				<div class="title">{{msg}}</div>\
				<div class="flex flex-hv-center">\
					<div class="flex-item text-center" v-on:click="close">取消</div>\
					<div class="flex-item text-center" v-on:click="confirm">确定</div>\
				</div>\
			</div>\
		</div>',
	topbarBasic:
		'<div class="topbar flex flex-hv-center">\
			<div class="btn btn-back" v-on:click="handleBack()">\
				<i class="icon icon-back"></i>\
			</div>\
			<div class="flex-item text-center">\
				<h2>{{propsData.title || title}}</h2>\
			</div>\
			<div class="btn"></div>\
		</div>',
	footbar: 
		'<div class="footbar">\
			<ul class="flex flex-hv-center">\
			</ul>\
		</div>',
	swiperBox:
		'<div class="swiper-container" v-if="propsData.items && propsData.items.length>0">\
			<div class="swiper-wrapper">\
				<div class="swiper-slide" v-for="(el, key) in propsData.items">\
					<div class="flex flex-hv-center">\
						<div class="wrap-img">\
							<img v-bind:src="el.imgSrc || \'static/images/cos_1.png\'" />\
						</div>\
					</div>\
				</div>\
			</div>\
			<div ref="pagination" class="swiper-pagination"></div>\
		</div>',
	scrollViewBox:
		'<section ref="scrollview" class="scroll-view" v-on:touchmove="handleMove" v-on:scroll="handleMove">\
			<Child :props-data="propsData" :scroll-data="scrolling"></Child>\
			<div ref="loadingtool" v-if="scrolling.status!==null && scrolling.status!==3" class="loading-tool">{{scrolling.msg}}</div>\
		</section>',
	proBox:
		'<section class="wrap-list-prd">\
			<Errorview :props-data="error"></Errorview>\
			<ul class="list-prd flex-v" v-if="propsData.items && propsData.items.length>0">\
				<li v-for="(el, key) in propsData.items" v-on:click="handleClickEl(el,$event)" :class="{even:key%2===0,odd:key%2===1}">\
					<div class="li-inner">\
						<figure class="flex">\
							<div class="wrap-img flex-hv-center"><img v-bind:src="el.imgSrc || \'static/images/cos_3.png\'" /></div>\
							<figcaption class="des-prd flex-1 flex flex-v flex-h-between">\
								<div class="flex title-des">\
									<div class="flex-1 text-overflow-2">{{el.title}}</div>\
								</div>\
								<div class="flex font-m">\
									<div class="label">月供:</div>\
									<div class="value text-overflow">{{el.supplyMonth}}{{el.unit}}</div>\
								</div>\
								<div class="flex">\
									<div class="flex-1 value price text-overflow color-red"><i v-if="el.price != \'面议\' && el.price != null" class="icon icon-rmb">￥</i><span>{{el.price || \'面议\'}}</span></div>\
									<div class="flex-1 mg-l-line text-right">\
										<div class="value area text-overflow">{{el.area || el.areaName}}</div>\
									</div>\
								</div>\
							</figcaption>\
						</figure>\
					</div>\
				</li>\
			</ul>\
		</section>',
}

var popWarning = Vue.extend({
	template: templates.popBox,
	data: function(){
		return {
			wrap: document.body,
			times: 1000,
			list: new Array()
		}
	},
	watch: {
		list: {
			handler: 'listWatch',
			deep: true
		}
	},
	methods: {
		listWatch: function(newVal,oldVal){
			//console.log(newVal,oldVal);
			// if(newVal.length>0){
			// 	this.pop();
			// }
		},
		pop: function(callback,times){
			var self = this;
			var times = times ? times : self.times;
			this.wrap.appendChild(this.$el);
			setTimeout(function(){
				self.close();
				callback && callback();
			},times);
		},
		close: function(){
			this.list = [];
			this.wrap.removeChild(this.$el);
		}
	}
});
var popWn = new popWarning().$mount();

var popConfirm = Vue.extend({
	template: templates.popConfirmBox,
	data: function(){
		return {
			wrap: document.body,
			msg: null,
			show: false,
			callback: null
		}
	},
	methods: {
		alert: function(msg){
			if(this.show === false){
				this.wrap.appendChild(this.$el);
				this.msg = msg;
				this.show = true;
			}
		},
		confirm: function(){
			this.callback && this.callback();
			this.close();
		},
		close: function(){
			this.$el.remove();
			this.msg = null;
			this.show = false;
			this.callback = null;
		}
	}
});
var popCf = new popConfirm().$mount();

var errorViewModel = Vue.extend({
	template: templates.errorViewBox,
	props: ['propsData']
})

var basicMixins = {
	data: function(){
		return {
			error: {
				status: 0,
				msg: '',
				msgArr: ['没有相关信息']
			},
			defaultParam: {

			}
		}
	},
	components: {
		Errorview: errorViewModel
	},
	props: ['propsData'],
	created: function(){
		if(this.propsData.error){
			_.assign(this.error,this.propsData.error);
		}
	},
	watch: {
		'error.status': function(a,b){
			if(a!==0){
				this.error.msg = this.error.msgArr[a-1];
			}
		}
	},
	methods: {
		loadData: function(){
			var self = this;
			var item = this.propsData;
			if(item.dataUrl && _basic.urlObj[item.dataUrl]){
				var url,param;
				var dataParam = item.dataParam ? _.assign({},self.defaultParam,item.dataParam) : self.defaultParam;
				param = _basic.postParam(dataParam);
				url = _basic.getUrl(item.dataUrl) + param;
				axios({
					method: 'post',
					url: url
				}).then(function(rep){
					if(rep.data.code === '0' && rep.data.data){
						self.error.status = 0;
						self.saveData(rep.data.data,item);
					}else{
						if(rep.data.code === '100' || rep.data.code === '101'){
							_basic.reLogin(window.location.href);
						}
						self.error.status = 1;
					}
				}).catch(function(e){
					console.log(e);
				});
			}
		},
		saveData: function(_data,_item){
			var data = _basic.formatData(_data,_item.dataRule);
			this.$set(_item,'data',data);
		},
		handleMore: function(_el){
			if(this.propsData.moreLink){
				if(typeof this.propsData.moreLink === 'function'){
					this.propsData.moreLink(_el);
				}else{
					_basic.gotoApp('linktohtml',_el.moreLink);
				}
			}
		},
		handleClickEl: function(_el){
			if(this.propsData.link){
				if(typeof this.propsData.link === 'function'){
					this.propsData.link(_el);
				}else{
					_basic.gotoApp('linktohtml',_el.link);
				}
			}
		}
	}
}

var modelMixins = {
	created: function(){
		this.loadData();
	},
	methods: {
		
	}
}

var listModelMixins = {
	props: ['propsData','scrollData'],
	data: function(){
		return {
			defaultParam: {
				pageSize: 4,
				pageNum: 1
			}
		}
	},
	watch: {
		'scrollData.adding': {
			handler: function(a,b){
				if(a===true){
					this.$set(this.scrollData,'adding',false);
					this.loadData();
				}
			},
			deep: true
		},
		'propsData.pause': {
			handler: function(a,b){
				if(a===false){
					this.loadData();
				}
			}
		}
	},
	created: function(){
		this.dataParam = this.propsData.dataParam ? _.assign({},this.defaultParam,this.propsData.dataParam) : this.defaultParam;
		if(!this.propsData.pause){
			this.loadData();
		}
	},
	methods: {
		reload: function(){
			this.propsData.items = [];
			this.dataParam.pageNum = 1;
			this.setScrollData(1);
			this.loadData();
		},
		loadData: function(_data){
			//console.log('listModelMixins-loading');
			var self = this;
			var item = _data || this.propsData;
			if(item.dataUrl && _basic.urlObj[item.dataUrl]){
				this.setScrollData(2);
				var url,param;
				this.dataParam = _.assign({},this.dataParam,this.propsData.dataParam);
				param = _basic.postParam(this.dataParam);
				url = _basic.getUrl(item.dataUrl) + param;
				var s = item.dataUrl;
				axios({
					method: 'post',
					url: url
				}).then(function(rep){
					var data = rep.data.data;
					if(rep.data.code === '0' && data){
						data.dataUrl = s;
						self.addToList(data,item);
					}else{
						if(rep.data.code === '100' || rep.data.code === '101'){
							_basic.reLogin(window.location.href);
						}
						if(item.items && item.items.length>0){
							self.setScrollData(3,rep.data);
						}else{
							self.setScrollData(4,rep.data);
						}
						
					}
				}).catch(function(e){
					console.log(e);
				});
			}
		},
		setScrollData: function(_status,_data){
			var status = _status;
			this.error.status = 0;
			switch(status) {
				case 1: //上划加载更多
					if(this.scrollData){
						this.$set(this.scrollData,'loading',false);
						this.$set(this.scrollData,'status',0);
					}
					break;
				case 2: //加载中…
					if(this.scrollData){
						this.$set(this.scrollData,'loading',true);
						this.$set(this.scrollData,'status',1);
					}
					break;
				case 3: //没有更多了
					if(this.scrollData){
						this.$set(this.scrollData,'loading',false);
						this.$set(this.scrollData,'status',2);
					}
					break;
				case 4: //没有数据
					this.error.status = 1;
					if(this.scrollData){
						this.$set(this.scrollData,'loading',false);
						this.$set(this.scrollData,'status',3);
					}
					break;
				default:
					if(this.scrollData){
						this.$set(this.scrollData,'loading',false);
					}
			}
			
		},
		addToList: function(_data,_item){
			var datas = _item ? _item : this.propsData;
			if(!(datas.items instanceof Array)){
				this.$set(datas,'items',new Array());
			}
			this.dataParam.totalPageNum = Math.ceil(_data.total/this.dataParam.pageSize) || 1;
			var arr = _data instanceof Array ? _data : _data.list;
			if(_data.dataUrl === datas.dataUrl){
				if(arr.length===0 || this.dataParam.pageNum > this.dataParam.totalPageNum){
					if(datas.items.length === 0){
						this.setScrollData(4);
					}else{
						this.setScrollData(3);
					}
				}else{
					if(this.dataParam.totalPageNum && this.dataParam.pageNum>=this.dataParam.totalPageNum){
						this.setScrollData(3);
					}else{
						this.setScrollData(1);
					}
					//this.dataParam.totalPageNum = Math.ceil(_data.total/this.dataParam.pageSize) || 1;
					this.dataParam.pageNum++;
					arr.forEach(function(el,key){
						var item = _basic.formatData(el,datas.itemsRule);
						datas.items.push(item);
					});
				}
			}
		}
	}
}

var proListModel = Vue.extend({
	template: templates.proBox,
	mixins: [basicMixins,listModelMixins],
	mounted: function(){
		//console.log(this.propsData.dataUrl)
	},
	methods: {

	}
});

var swiperModel = Vue.extend({
	template: templates.swiperBox,
	mixins: [basicMixins,listModelMixins],
	mounted: function(){
		//console.log(this.propsData)
	},
	watch: {
		'propsData.items': {
			handler: function(a,b){
				var self = this;
				this.$nextTick(function(){
					var swiper = self.$el;
					var pagination = self.$refs.pagination;
					if(a.length>1){
						self.mySwiper = new Swiper(swiper, {
							loop: true,
							pagination: pagination
						})
						self.mySwiper.update();
					}
				});
			},
			deep: true
		}
	}
});

var scrollViewModel = Vue.extend({
	template: templates.scrollViewBox,
	props: ['propsData'],
	data: function(){
		return {
			scrolling: {
				status: null,
				msg: '',
				msgArr: ['上划加载更多~', '加载中…', '没有更多了','没有数据'],
				loading: false,
				adding: false
			}
		}
	},
	watch: {
		'scrolling.status': {
			handler: function(a,b){
				this.scrolling.msg = this.scrolling.msgArr[a];
			},
			deep: true
		}
	},
	components: {
		Child: proListModel
	},
	mounted: function(){
		var self = this;
		setTimeout(function(){
			var scrollview = self.$refs.scrollview;
			document.body.onscroll = function(e){
				self.move();
			}
		},100);
	},
	methods: {
		move: function(){
			var self = this;
			var tool = self.$refs.loadingtool;
			var scrollview = self.$refs.scrollview;
			var bd = document.body;
			var wh = window.innerHeight;
			var st = 0;
			if(scrollview.offsetHeight<window.innerHeight){
				bd = scrollview;
				wh = bd.offsetHeight+bd.offsetTop;
				st = bd.scrollTop;
			}else{
				st = window.scrollY || window.pageYOffset || bd.scrollTop;
			}
			var tool_position_bottom = tool ? tool.offsetTop+tool.offsetHeight : 0;
			var bottomPosition = st+wh;
			//console.log(bd.scrollTop+wh,tool_position_bottom-10,self.scrolling.status)
			if(st>0){
				this.propsData.isTop = false;
			}else{
				this.propsData.isTop = true;
			}
			//console.log(bottomPosition,tool_position_bottom-tool.offsetHeight/3)
			//document.getElementById('info').innerHTML = document.body.scrollTop + '——' +document.body.clientHeight+ '——' +window.innerHeight + '——' + '——'+ !self.scrolling.loading + '——' + self.scrolling.status+e.timeStamp
			if(bottomPosition >= tool_position_bottom-10 && !self.scrolling.loading && self.scrolling.status === 0 && !self.scrolling.adding){

			//document.getElementById('info').innerHTML = document.body.scrollTop + '——' +window.innerHeight + '——' + tool_position_bottom+ '——'+ !self.scrolling.loading + '——' + self.scrolling.status
				self.scrolling.adding = true;
				//console.log(self.scrolling.loading)
			}
		},
		handleMove: function(){
			var self = this;
			if(self.timeout != null){
				clearTimeout(self.timeout);
			}
			self.timeout = setTimeout(function(){
				self.move()
			},200);
		}
	}
});

var topBarModel = Vue.extend({
	template: templates.topbarBasic,
	props: ['propsData'],
	data: function(){
		return {
			title: document.getElementsByTagName('title')[0].text
		}
	},
	methods: {
		handleBack: function(_url){
			if(_url){
				window.location.href = _url;
			}else{
				history.back();
			}
		}
	}
});
var footBarModel = Vue.extend({
	template: templates.footbar,
	props: ['propsData']
});



