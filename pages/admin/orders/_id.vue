<template lang='pug'>
	v-layout

</template>

<script>
	import axios from 'axios';

	export default {
		data(){
			return {
				order:{}
			}
		},
		layout:'admin',
		beforeMount(){
			this.getOrder();
		},
		methods:{
			getOrder(){
				axios
				.get(`http://localhost:3000/api/orders/${this.$route.params.id}`)
				.then(response => {
					if(response.data.errCode === 0){
						console.log(response.data.order);
					}
				})
				.catch(err => console.log(err));
			}

		}

	}

</script>