<template lang='pug'>
v-content(fluid)
	v-toolbar(flat color="white")
		v-toolbar-title ORDERS
		v-divider(class="mx-2" inset vertical)
		v-spacer
		v-dialog(v-model="dialog" persistent max-width="600px")
			v-card(color="white")
				v-card-title
					v-flex(xs12)
						div
							span(class="headline") Order
						div
							span(class="validText") {{ validFormText }}
				v-card-text
					v-container(grid-list-md)
						v-layout(wrap)
							v-flex(xs12 sm6 md6)
								v-text-field(disabled v-model="showItem.created" label="Created")
							v-flex(xs12 sm6 md6)
								v-text-field(disabled v-model="showItem.consumer" label="Consumer")
							v-flex(xs12 sm6 md6)
								v-text-field(disabled v-model="showItem.purchase" label="Purchase")
							v-flex(xs12 sm6 md6)
								v-text-field(disabled v-model="showItem.quantity" label="Quantity")
				//-v-data-table()
				v-card-actions
						v-spacer
						v-btn(color="blue darken-1" flat @click="closeForm") Cancel
	v-data-table(
		id='admin_orders'
		:headers="headOrders"
		:items="orders"
		hide-actions
		class="elevation-6"
		)
		template(
			slot="items"
			slot-scope="props"
		)
			tr(class="tr_hover" @click="showOrder(props.item)")
				td(class="text-xs-center") {{ new Date(props.item.created).toLocaleString() }}
				td(class="text-xs-center") {{ props.item.consumer }}
				td(class="text-xs-center") {{ props.item.purchase }}
				td(class="text-xs-center") {{ props.item.quantity }}
				td(class="text-xs-center") {{ props.item._id }}
				td(class="justify-center layout px-0")
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
			validFormText: "",
			showItem: {
				created: null,
				consumer: "",
				purchase: 0,
				quantity: 0,
				id: null
			},
			defaultItem:{
				created: null,
				consumer: "",
				purchase: 0,
				quantity: 0,
				id: null
			},
			headOrders:[
				{text: 'Created', align: 'center', sortable: false, value: 'created'},
				{text: 'Consumer', align: 'center', sortable: false, value: 'consumer'},
				{text: 'Purchase', align: 'center', sortable: false, value: 'purchase'},
				{text: 'Q-ty', align: 'center', sortable: false, value: 'quantity'},
				{text: 'ID', align: 'center', sortable: false, value: '_id'},
				{text: 'Actions', align: 'center', sortable:false, value:'_id'}
			],
			paginationOrders:{
				sortBy: 'created',
				page: 1,
				rowsPerPage: 10,
				totalItems: 0
			},
			selectedOrders: [],
			dataOrders:[]
		}
	},
	middleware: 'authenticated',
	layout: 'admin',
	computed: {
		orders: function(){
			console.log(this.dataOrders['orders']);
			return this.dataOrders['orders'];
		}
	},
	beforeMount(){
		this.getOrders();
	},
	methods: {
		getOrders(){
			axios
			.get('http://localhost:3000/api/orders')
			.then(response => {
				if(response.data.errCode === 0){
					this.dataOrders = response.data;
					this.paginationOrders.totalItems = response.data.count;
				}
			})
			.catch(err => console.log(err));
		},
		deleteItem(id){
			console.log(id);
			axios
			.delete(`http://localhost:3000/api/orders/${id}`)
			.then(response => {
				console.log(response);
				this.getOrders();
			})
			.catch(err => console.log(err));
		},
		showOrder(item){
			this.dialog = true;
			this.showItem.created = new Date(item.created).toLocaleString();
			this.showItem.consumer = item.consumer;
			this.showItem.purchase = item.purchase;
			this.showItem.quantity = item.quantity;
		},
		closeForm(){
			this.dialog = false;
			setTimeout(() => {
				this.showItem = Object.assign({}, this.defaultItem);
			}, 300);
		}
	}
}
</script>
<style lang="stylus">
	.tr_hover
		cursor:pointer
	.title
		color: #3F51B5
		font-weight: bold
		font-size 150%

</style>