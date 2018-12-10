<template lang='pug'>
v-app
	v-toolbar(dark color='red' fixed)
		v-toolbar-side-icon
		v-toolbar-title 
			nuxt-link(id="link-pr" :to="{ name: 'admin'}") 
				span(id="link") SHOP
		v-spacer
		v-btn(icon :disabled='!show')
			
			v-badge(
				left 
				overlap
				v-model="show"
				color='blue'
			)
				span(slot="badge") {{ count }}
				nuxt-link(:to="{ name: 'order'}")
					v-icon(large :color="badge_color") shopping_basket
		v-btn(icon)
			nuxt-link(id="link-pr" :to="{ name: 'admin'}") 
				v-icon(large color="white") settings

	nuxt
</template>

<script>
export default {
	data(){
		return {
		}
	},
	computed:{
		badge_color(){
			if(this.$store.getters.orderedProducts.length > 0){
				return 'yellow';
			}else{
				return 'white';
			}
		},
		show() {
			if(this.$store.getters.orderedProducts.length > 0){
				return true;
			}else{
				return false;
			}
		},
		count(){
			return this.$store.getters.orderedProducts.length;
		}
	}

}
</script>
<style lang="stylus" scoped>
	#link, #link-pr
		color white
		text-decoration: none
	a
		text-decoration: none
</style>
