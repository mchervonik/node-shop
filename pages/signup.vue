<template lang='pug'>
v-content(id='signup')
	v-container
		v-layout(align-center justify-center)
			v-flex(xs10 sm8 md6)
				v-card(class="elevation-12")
					v-toolbar(dark color="blue")
						v-toolbar-title SignUp Form
						v-spacer
						v-btn(flat to="/login") Login
					v-card-text
						p(v-if="!!errserver" class="error-span") {{ errserver }}
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
						v-btn(dark color="blue" @click="postSignUp") SignUp
</template>

<script>
	import { required, minLength, email } from 'vuelidate/lib/validators';
	import axios from 'axios';
	export default {
		data(){
			return {
				password: null,
				email: null,
				errserver: ""
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
			postSignUp(){
				this.$v.email.$touch();
				this.$v.password.$touch();
				this.errserver = "";
				if(!this.$v.email.$invalid && !this.$v.password.$invalid){
					axios({
						method: 'post', 
						url: `http://localhost:3000/api/user/signup`,
						data:{
							email:this.email,
							password: this.password
						}
					})
					.then(response => {
						console.log(response.data);
					})
					.catch(err => {
						this.errserver = "SignUp failed";
					});
				}
			}
		}
	}
</script>
<style lang="stylus">
	#signup
		margin 70px
	.error-span
		color red
</style>