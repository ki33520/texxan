/*!
 * vue-common.js
 */
var templates = {
	bubble: '<div class="bubble">\
		<p>counter</p>\
	</div>'
}

let btnComp = Vue.extend({
	template: templates.bubble,
	data(){
		return {
			
		}
	},
	methods: {
		
	}
})

var indexApp = new Vue({
	el: '#app',
	data : function(){
		return {

		}
	},
	components: {
		'bubble': btnComp,
	},
	methods: {

	}
})