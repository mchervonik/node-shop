export default function({ store, redirect }){
	if(store.state.auth){
		console.log('notAuthenticated');
		return redirect('/')
	}
}