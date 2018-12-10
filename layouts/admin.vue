<template lang='pug'>
v-app
	v-toolbar(dark color='indigo')
		v-toolbar-side-icon
		v-toolbar-title 
			nuxt-link(id="link-pr" :to="{ name: 'admin'}") 
				span(id="link") ADMIN
		v-spacer
		v-toolbar-items(class='hidden-sm-and-down')
			//v-btn(flat class="hover" :class='{active: activeBtn === "btn1"}' :to="{name: 'admin'}" @click='activeBtn = "btn1"') Stats
			v-btn(flat :class='{active: activeBtn === "btn2", hover: hoverBtn != "btn2"}'  :to="{name: 'admin-users'}" @click='activeBtn = "btn2"') Users
			v-btn(flat :class='{active: activeBtn === "btn3", hover: hoverBtn != "btn3"}'  :to="{name: 'admin-products'}" @click='activeBtn = "btn3"') Products
			v-btn(flat :class='{active: activeBtn === "btn4", hover: hoverBtn != "btn4"}' :to="{name: 'admin-orders'}" @click='activeBtn = "btn4"') Orders
	nuxt
</template>

<script>
export default {
	data(){
		return {
			activeBtn: '',
			hoverBtn: ''
		}
	}
}
</script>
<style lang="stylus" scoped>
	#link, #link-pr
		color white
		text-decoration: none
	.active
		background-color white
		color #3F51B5
	.hover:hover
		background-color: white
		color #3F51B5
		

</style>