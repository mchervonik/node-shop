import Vuex from 'vuex';
const cookieparser = process.server ? require('cookieparser') : undefined

const createStore = () => {
	return new Vuex.Store({
		state:{
			products: [],
			auth: null,
			userId: null
		},
		getters:{
			orderedProducts(state){
				return state.products;
			},
			currentUserId(state){
				return state.userId;
			}
		},
		mutations: {
			signUser(state, id){
				state.userId = id;
			},
			addProduct(state, payload){
				const find = state.products.find(prod => {
					return prod.productId == payload.productId;
				})
				if(!find){
					const product = {
						productId: payload.productId,
						quantity: payload.quantity,
						name: payload.name,
						price: payload.price,
						isSelected: true
					};
					state.products.push(product);
				}
			},
			removeProduct(state, payload){
				const product = state.products.find(prod => {
					return prod.productId == payload.productId;
				})
				if(product)
					state.products.splice(state.products.indexOf(product),1);
			},
			purgeProducts(state){
				state.products = [];
			},
			setAuth(state, auth){
				state.auth = auth;
			}

		},
		actions:{
			nuxtServerInit({ commit }, { req }){
				let auth = null;
				if(req.headers.cookie){
					const parsed = cookieparser.parse(req.headers.cookie);
					try{
						auth = JSON.parse(parsed.auth)
					} catch(err){
						console.log(err);
					}
				}
				commit('setAuth', auth);
			}
		}
	})
}

export default createStore