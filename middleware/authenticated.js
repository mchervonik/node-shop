export default function({ store, redirect }){
	if(!store.state.auth){
		console.log('Authenticated');
		return redirect('/login');
	}
}