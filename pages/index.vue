<template lang='pug'>
	v-content(id='shop')
		v-container(grid-list-x1)
			v-layout(row wrap justify-center)
				v-flex(id='prod_card' xs6 sm4 md3 v-for='prod in products' :key='prod._id')
					v-card(hover max-width='250px' )
						v-img(
							:src='prod.productImage.path' 
							aspect-ratio='0.65'
						)
						v-card-title(primary-title)
							div
								h3(class='headline') {{ prod.name}}
								div Price: {{ prod.price}}
						v-card-actions
							v-btn(flat color='blue' :data-name='prod.name' :data-price='prod.price' :data-id='prod._id' @click='addProd($event)') {{ btnLabels.add }}

</template>

<script>
import axios from 'axios';
export default {
	data(){
		return {
			products: [],
			btnLabels: { add:'Add to basket', rem:'Remove from basket' }
		}
	},
	beforeMount(){
		this.getProducts();
		this.$store.commit('purgeProducts');
	},
	computed:{
		image: function(){
			console.log(!!this.products.productImage);
			return this.products.productImage ? true: false;
		}
	},
	methods:{
		getProducts(){
			axios
			.get('http://localhost:3000/api/products')
			.then(response => {
				if(response.data.errCode === 0){
					this.products = response.data.products;
					console.log(this.products);
				}
			})
			.catch(err => console.log(err));
		},
		addProd(e){
			let target = parent = e.target;
			const product = {};
			if(target.tagName == 'BUTTON'){
				target = target.firstChild;
			}else{
				parent = target.parentNode;
			}
			if(target.innerHTML === this.btnLabels.add){
				target.innerHTML = this.btnLabels.rem;
				target.style.color = 'red';
				this.$store.commit({
					type: 'addProduct',
					productId: parent.dataset.id,
					quantity: 1,
					name: parent.dataset.name,
					price: parent.dataset.price
				})
			}else{
				target.innerHTML = this.btnLabels.add;
				target.style.color = 'blue';
				this.$store.commit({
					type: 'removeProduct',
					productId: parent.dataset.id
				})
			}
		}
	}
}
</script>
<style lang='stylus' scoped>
	#prod_card
		margin: 5px;
	#shop
		margin-top 50px
</style>
