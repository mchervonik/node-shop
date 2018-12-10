<template lang='pug'>
	div(style="max-width: 600px; margin: auto;")
		v-card(flat)
			v-container(fluid grid-list-lg)
				v-layout(row wrap)
					v-flex(
						xs6
						v-for="(item, index) in stats"
						:key="index"
					)
						v-card(class="elevation-8")
							v-layout
								v-flex(xs12)
									v-card-title(id='figure' primary-title)
										h1(id='figure') {{ item.number}}
							v-divider
							v-card-actions(style="background-color: #3F51B5;")
								h4(style="color: white;") {{ item.title }}
	  	
</template>

<script>
import axios from 'axios';
export default { 
	data(){
		return {
			stats: [
				{ number: 0, title: "Total amount of consumers"},
				{ number: 0, title: "Total items of product"},
				{ number: 0, title: "Total orders"},
				{ number: 0, title: "Total sum of purchases"},
				{ number: 0, title: "Total items sold"},
				{ number: 0, title: "Avarage price per one order"}
			],
			data:[]
		}
	},
	middleware: 'authenticated',
	layout: 'admin',
	beforeMount(){
		this.getStats();
	},
	methods: {
		getStats(){
			axios
			.get('http://localhost:3000/api/stats')
			.then(response => {
				if(response.data.errCode === 0){
					this.stats[0]['number'] = response.data.usr_cnt;
					this.stats[1].number = response.data.prd_cnt;
					this.stats[2].number = response.data.ord_cnt;
					this.stats[3].number = response.data.ord_pchs;
					this.stats[4].number = response.data.ord_itm_sold;
					this.stats[5].number = response.data.ord_avr_prc;
				}
			})
			.catch(err => console.log(err));
		}

	}
}
</script>
<style lang="stylus" scoped>
	.tr_hover
		cursor:pointer
	#figure
		margin: auto
		text-align center
	#div-figure
		margin: auto

</style>