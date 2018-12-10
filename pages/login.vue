<template lang='pug'>
v-content(id='login')
	v-container
		v-layout(align-center justify-center)
			v-flex(xs10 sm8 md6)
				v-card(class="elevation-12")
					v-toolbar(dark color="blue")
						v-toolbar-title Login Form
						v-spacer
						v-btn(flat to="/signup") SignUp
					v-card-text
						v-text-field(prepend-icon="person" type="text" name='email' label='Email' v-model='$v.email.$model')
						div(v-if="$v.email.$error")
							p(v-if="!$v.email.required" class="error-span") Field is required
							p(v-else-if="!$v.email.email" class="error-span") Email is invalid
						v-text-field(prepend-icon="lock" name="password" type="password" label='Password' v-model='$v.password.$model')
						div(v-if="$v.password.$error")
							p(v-if="!$v.password.required" class="error-span") Field is required
							p(v-if="!$v.password.minLength" class="error-span") Name must have at least {{ $v.password.$params.minLength.min}} letters
					v-card-actions
						v-btn(to="/") Back
						v-spacer
						v-btn(dark color="blue" @click="postLogin") Login
</template>

<script>
	const Cookie = process.client ? require('js-cookie') : undefined;
	import { required, minLength, email } from 'vuelidate/lib/validators';
	import axios from 'axios';
	export default {
		data(){
			return {
				password: null,
				email: null
			}

		},
		validations:{
			password:{
				required,
				minLength: minLength(5)
			},
			email:{
				required,
				email
			}
		},
		middleware: 'notAuthenticated',
		methods:{
			postLogin(){
				console.log(this.$v.email);
				console.log(this.$v.password.$params.minLength.min);
				if(!this.$v.email.$invalid && !this.$v.password.$invalid){
					axios({
						method: 'post', 
						url: `http://localhost:3000/api/user/login`,
						data:{
							email:this.email,
							password: this.password
						}
					})
					.then(response => {
						if(response.data.errCode == 0){
							console.log(response.data);
							const token = response.data.token;
							if(token){
								console.log('Login success');
								this.$store.commit("signUser", response.data.userId);
								this.$store.commit('setAuth', token);
								Cookie.set('auth', token);
								this.$router.push("/order");
							}else{
								this.$router.push("/signup");
							}
						}else{
							this.$router.push("/signup");
						}
					})
					.catch(err => {
						this.$router.push("/signup");
					});
				}
			}
		}
	}
</script>
<style lang="stylus">
	#login
		margin 70px
	.error-span
		color red
</style>