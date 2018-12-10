<template lang='pug'>
v-content(fluid)
	div
		v-toolbar(flat color="white")
			v-toolbar-title PRODUCTS
			v-divider(class="mx-2" inset vertical)
			v-spacer
			v-dialog(v-model="dialog" persistent max-width="500px")
				v-btn(slot="activator" color='indigo' dark class="mb-2") New Product
				v-card(color="white")
					v-card-title
						v-flex(xs12)
							div
								span(class="headline") {{ formTitle }}
							div
								span(class="validText") {{ validFormText }}
					v-card-text
						v-container(grid-list-md)
							v-layout(wrap)
								v-flex(xs12 sm6 md4)
									v-text-field(v-model="editedItem.name" label="Name")
								v-flex(xs12 sm6 md4)
									v-text-field(v-model="editedItem.price" label="Price")
							v-layout(wrap)
								v-card
									v-flex(xs12 sm12 md12)
										input(id="btnFileInput" ref="fileInput" type="file" @change="onFileSelected")
									//-v-flex(xs12 sm12 md12)
										v-btn(@click="onUpload") Upload
					v-card-actions
						v-spacer
						v-btn(color="blue darken-1" flat @click="closeForm") Cancel
						v-btn(
							color="blue darken-1" 
							flat 
							@click="editedItem.id ? patchForm(): postForm()") Save
		v-data-table(
  			id='admin_products'
  			:headers="headProducts"
  			:items="products"
  			item-key="_id"
  			hide-actions
  			class="elevation-6"
  		)
			template(
  				slot="items"
  				slot-scope="props"
  			)
				//-router-link(:to="{name:'admin'}" tag='tr' class='tr_hover')
				td(class="text-xs-center") {{ props.item.name }}
				td(class="text-xs-center") {{ props.item.price }}
				td(class="text-xs-center") {{ props.item._id }}
				td(class="justify-center layout px-0")
					v-icon(
						small 
						class="mr-2"
						@click="editItem(props.item)"
					) edit
					v-icon(
						small 
						class="mr-2"
						@click="deleteItem(props.item._id)"
					) delete
				
</template>

<script>
import axios from 'axios';
export default { 
	data(){
		return {
			dialog: false,
			selectedFile: null,
			validFormText: "",
			productImage: "",
			defaultItem:{
				name: "",
				price: 0,
				id: null
			},
			editedItem: {
				name: "",
				price: 0,
				id: null
			},
			headProducts:[
				{text: 'Name', align: 'center', sortable: false, value: 'name'},
				{text: 'Price', align: 'center', sortable: false, value: 'price'},
				{text: 'ID', align: 'center', sortable: false, value: '_id'},
				{text: 'Actions', align: 'center', sortable:false, value:'_id'}
			],
			paginationProducts:{
				sortBy: 'name',
				page: 1,
				rowsPerPage: 10,
				totalItems: 0
			},
			selectedProducts: [],
			dataProducts:[],
		}
	},
	middleware: 'authenticated',
	layout: 'admin',
	computed: {
		products: function(){
			return this.dataProducts['products'];
		},
		formTitle: function(){
			return this.editedItem.id ? "Edit Product": "New Product";
		}
	},
	beforeMount(){
		this.getProducts();
	},
	methods: {
		getProducts(){
			axios
			.get('http://localhost:3000/api/products')
			.then(response => {
				if(response.data.errCode === 0){
					this.dataProducts = response.data;
					this.paginationProducts.totalItems = response.data.count;
				}
			})
			.catch(err => console.log(err));
		},
		deleteItem(id){
			console.log(id);
			axios
			.delete(`http://localhost:3000/api/products/${id}`)
			.then(response => {
				console.log(response);
				this.getProducts();
			})
			.catch(err => console.log(err));
		},
		editItem(item){
			this.dialog = true;
			this.editedItem.name = item.name;
			this.editedItem.price = item.price;
			this.editedItem.id = item._id;
		},
		closeForm(){
			this.dialog = false;
			setTimeout(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.validFormText = "";
				this.productImage = "";
				this.selectedFile = null;
				this.$refs.fileInput.value = "";
			}, 300);
		},
		postForm(){
			console.log("POST");
			const isCallServer = this.validForm();
			if(isCallServer){
				const fd = new FormData();
				fd.append('name', this.editedItem.name);
				fd.append('price', this.editedItem.price);
				if(this.selectedFile != null){
					fd.append('productImage', this.selectedFile, this.selectedFile.name);
					axios
					.post("http://localhost:3000/api/products/", fd)
					.then(response => {
						this.closeForm();
						this.getProducts();
					})
					.catch(err => console.log(err));
				}else{
					this.validFormText = "You should choose image";
				}
			}
		},
		patchForm(){
			console.log("PATCH");
			const isCallServer = this.validForm();
			if(isCallServer){
				const arrData = Object.keys(this.editedItem)
				.filter(item => item !== 'id')
				.map(key => {
					return {
						propName: key,
						value: this.editedItem[key]
					}
				});
				this.onUpload(err => {
					if(this.productImage && !err){
						arrData.push({
							propName: "productImage",
							value: this.productImage
						})
					}
					if(arrData.length > 0){
						axios
						.patch(`http://localhost:3000/api/products/${this.editedItem.id}`, arrData)
						.then(response => {
							console.log(response);
							this.closeForm();
							this.getProducts();
						})
						.catch(err => console.log(err));
					}
				});
			}
		},
		onFileSelected(e){
			this.selectedFile = e.target.files[0];
		},
		onUpload(cb){
			if(this.selectedFile){
				const formData = new FormData();
				formData.append('productImage', this.selectedFile, this.selectedFile.name)
				axios
				.post('http://localhost:3000/api/images', formData)
				.then(response => {
					this.productImage = response.data._id;
					cb();
				})
				.catch(err => {
					console.log(err);
					cb(err);
				});
			}else{
				cb();
			}
		},
		validForm(){
			if(this.editedItem.name && this.editedItem.price){
				this.validFormText = "";
				return true;
			}else{
				this.validFormText = "Name or Price are empty";
				return false;
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
	.tr_hover
		cursor:pointer
	
	#btnFileInput
		padding 7px
		border-radius inherit
		box-sizing inherit
		color inherit
		align-items center
		display flex
		flex 1 0 auto
		justify-content center
		position relative
		transition 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)
		white-space nowrap
	.validText
		color red
		background-color white
</style>