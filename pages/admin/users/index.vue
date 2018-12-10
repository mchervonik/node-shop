<template lang='pug'>
v-content(fluid)
	v-layout()
		v-flex()
			v-card(color='indigo lighten-5')
				v-card-title(primary-title) 
					span(class='title') USERS
				v-card-text
					v-data-table(
			  			id="admin_orders"
			  			:headers="headUsers"
			  			:items="users"
			  			hide-actions
			  			class="elevation-6"
			  		)
						template(
			  				slot="items"
			  				slot-scope="props"
			  			)
							router-link(
			  					:to="{name:'admin'}"
			  					tag='tr'
			  					class='tr_hover'
			  				)
								td(class="text-xs-center") {{ props.item.email }}
								td(class="text-xs-center") {{ props.item.qt_orders }}
								td(class="text-xs-center") {{ roundNumber(props.item.purchases, 2) }}
								td(class="text-xs-center") {{ props.item._id }}
</template>

<script>
import axios from 'axios';
export default { 
	data(){
		return {
			headUsers:[
				{text: 'Email', align: 'center', sortable: false, value: 'email'},
				{text: 'Qt Orders', align: 'center', sortable: false, value: 'qt_orders'},
				{text: 'Sum', align: 'center', sortable: false, value: 'purchases'},
				{text: 'ID', align: 'center', sortable: false, value: '_id'}
			],
			paginationUsers:{
				sortBy: 'email',
				page: 1,
				rowsPerPage: 10,
				totalItems: 0
			},
			selectedUsers: [],
			dataUsers:[],
		}
	},
	middleware: 'authenticated',
	layout: 'admin',
	computed: {
		users: function(){
			return this.dataUsers['users'];
		}
	},
	beforeMount(){
		this.getUsers();
	},
	methods: {
		getUsers(){
			axios
			.get('http://localhost:3000/api/user/all')
			.then(response => {
				if(response.data.errCode === 0){
					this.dataUsers = response.data;
					this.paginationUsers.totalItems = response.data.count;
				}
			})
			.catch(err => console.log(err));
		},
		roundNumber(value, decimals){
			return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
		}
	}
}
</script>
<style lang="stylus">
	.tr_hover
		cursor:pointer

</style>