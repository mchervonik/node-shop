<template lang='pug'>
	v-content(id='shop')
		v-container
			v-layout(raw wrap)
				v-flex(xs6 offset-xs3)
					v-card(flat v-if="main_container")
						v-card-title 
							div 
								h3(class="headline mb-0") YOUR ORDER
								v-divider(light)
								v-layout(column align-space-around)
									v-flex(v-for='(product, index) in products' :key='index' ref='child')
										v-layout(row wrap align-center justify-space-between)
											v-layout(row wrap justify-start)
												v-chip(close v-model='product.isSelected' @input='onClose(product, index)')
													span {{ product.name }}
											v-layout(row wrap align-center justify-end)
												v-flex(xs12 offset-xs1)
													div
														h4(v-if='product.isSelected' :data-price='index') {{ product.price }}
											v-layout(row wrap align-center justify-start)
												v-btn(v-if='product.isSelected' fab small color='green' @click='increment(index)')
													v-icon add
												h4(v-if='product.isSelected' :data-item='index') 1
												v-btn(v-if='product.isSelected' fab small color='red' @click='decrement(index)')
													v-icon remove
											v-layout(id='total_price' row wrap align-center justify-end)
												h2(v-if='product.isSelected' color="green" :data-sum='index') {{ product.price }}
									v-divider
									v-layout(row align-center justify-space-between)
										v-chip Total
										h2(id='total_sum') {{ total_sum }}
						v-card-actions
							nuxt-link(:to="{ name: 'index'}")
								v-btn(flat color='red')
									v-icon() keyboard_backspace
									span Back to Shop
							v-btn(
								flat 
								:disabled="dialog"
								:loading="dialog"
								color='green' 
								@click='submitOrder()')
								span Submit Order
		div
			v-dialog(
				v-model="dialog"
				hide-overlay
				persistent
				width="300"
			)
				v-card(color="promary" dark)
					v-card-text Please wait
						v-progress-linear(
							indeterminate
							color="white"
							class="mb-0"
						)
		div
			v-dialog(
				v-model="success_dialog"
				hide-overlay
				persistent
				width="300"
			)
				v-card(hover max-width="300")
					v-img(src='Dumbledore-about-happiness-harry-potter-23536140-500-300.jpg' aspect-ratio='2.0')
					v-card-title(primary-title) Thanks for order!
					v-card-actions
						v-btn(
							:to="{ name: 'index'}"
							@click="success_dialog = false"
						) Return to Shop



</template>

<script>
import axios from 'axios';
export default{
	data(){
		return {
			dialog: false,
			success_dialog: false,
			main_container: true

		}
	},
	computed:{
		products(){
			return this.$store.getters.orderedProducts;
		},
		total_sum(){
			const products = this.$store.getters.orderedProducts;
			if(products.length > 0){
				return products.map(item => {
					return parseFloat(item.price);
				}).reduce( (sum, acc) => {
					return Number(Math.round(sum + acc + 'e2') + 'e-2');
				})
			}else{
				return 0;
			}
		}
	},
	middleware: 'authenticated',
	methods:{
		onClose(product, index){
			if(product){
				const el_s = this.$el.querySelector(`[data-sum = '${index}']`);
				const el_t = this.$el.querySelector('#total_sum');
				const num_s = parseFloat(el_s.innerText);
				let num_t = parseFloat(el_t.innerText);
				product.isSelected = false;
				el_t.innerText = this.roundNumber(num_t - num_s, 2);
				this.$store.commit({
					type: 'removeProduct',
					productId: product.productId
				})
			}
		},
		increment(index){
			const el_p = this.$el.querySelector(`[data-price = '${index}']`);
			const el_i = this.$el.querySelector(`[data-item = '${index}']`);
			const el_s = this.$el.querySelector(`[data-sum = '${index}']`);
			const el_t = this.$el.querySelector('#total_sum');
			const num_p = parseFloat(el_p.innerText);
			let num_i = parseFloat(el_i.innerText);
			if(num_i >= 0){
				num_i += 1;
				el_i.innerText = num_i;
				const num_s = this.roundNumber(num_p * num_i, 2);
				el_s.innerText = num_s;
				el_t.innerText = this.getTotalSum();
			}
		},
		decrement(index){
			const el_p = this.$el.querySelector(`[data-price = '${index}']`);
			const el_i = this.$el.querySelector(`[data-item = '${index}']`);
			const el_s = this.$el.querySelector(`[data-sum = '${index}']`);
			const el_t = this.$el.querySelector('#total_sum');
			const num_p = parseFloat(el_p.innerText);
			let num_i = parseFloat(el_i.innerText);
			if(num_i > 1){
				num_i -= 1;
				el_i.innerText = num_i;
				const num_s = this.roundNumber(num_p * num_i, 2);
				el_s.innerText = num_s;
				el_t.innerText = this.getTotalSum();
			}
		},
		getTotalSum(){
			const els_s = Array.prototype.slice.call(this.$el.querySelectorAll(`[data-sum]`));
			if(els_s){
				return els_s.map(el => {
					return parseFloat(el.innerText);
				}).reduce((sum, acc) => {
					return this.roundNumber(sum + acc, 2);
				},0)
			}
		},
		roundNumber(value, decimals){
			return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
		},
		submitOrder(){
			const products = this.$store.getters.orderedProducts;
			this.dialog = true;
			const userId = this.$store.getters.currentUserId;
			if(products.length > 0 && !!userId){
				const post_data = products.map(product => {
					return {
						productId: product.productId,
						quantity: product.quantity
					}
				})
				axios({
					method: 'post',
					url: 'http://localhost:3000/api/orders',
					data: {
						products: post_data,
						userId: userId
					}
				})
				.then(response => {
					if(response.data.createdOrder){
						this.$store.commit('purgeProducts');
						console.log('Successfuly created');
					}else{
						console.log(response);
					}
					this.dialog = false;
					this.main_container = false;
					this.success_dialog = true;
				})
				.catch(err => console.log(err));

			}
		}
	}
}

</script>
<style lang='stylus'>
	#shop
		margin-top 100px
	#total_price
		margin-left 25px
	a
		text-decoration: none
</style>