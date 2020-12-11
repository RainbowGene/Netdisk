<template>
	<view>
		<view v-if="show" class="position-fixed top-0 bottom-0 right-0 left-0 flex align-center justify-center bg-light"
		 style="z-index: 100;">
			<text class="font text-muted">Loading...</text>
		</view>
		<view style="height: 44px;"></view>
		<view class="flex align-center justify-center font-lg text-muted" style="margin-top: 100rpx;">
			欢迎回来
		</view>
		<view class="px-4">
			<input class="uni-input bg-light rounded mb-4" placeholder="手机号/用户名/邮箱" type="text" v-model="form.username" />
			<input class="uni-input bg-light rounded mb-4" placeholder="请输入密码" type="text" v-model="form.password" />
			<input v-if="type==='reg'" class="uni-input bg-light rounded mb-4" placeholder="请确认密码" type="text" v-model="form.repassword" />
			<view class="py-2 bg-main text-white flex align-center justify-center font-lg rounded-circle" hover-class="bg-main-hover"
			 @click="submit">
				{{type ==='login'?'登 录':'注 册'}}
			</view>
		</view>
		<view class="flex align-center justify-center pt-5">
			<view class="text-muted mx-2 font-sm" @click="handleRegOrLogin">
				{{type ==='login'?'注册账号':'去登录'}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 'login',
				form: {
					username: 'GeneClycle',
					password: "123456",
					repassword: ""
				},
				show: false
			}
		},
		onLoad() {
			this.show = true
			if (!this.$store.state.token) {
				uni.showToast({
					title: 'please login',
					icon: 'none'
				});
				return this.show = false
			}
			uni.switchTab({
				url: "../index/index"
			})
		},
		methods: {
			handleRegOrLogin() {
				this.type = this.type === 'login' ? 'reg' : 'login';
				this.form.username = ''
				this.form.password = ''
				this.form.repassword = ''
			},
			// 提交表单
			submit() {
				this.$H.post(`/${this.type}`, this.form).then(res => {
					console.log(res);
					uni.showToast({
						title: this.type === 'login' ? '登录成功' : '注册成功',
						icon: 'none'
					});
					if (this.type === 'login') {
						// 存入vuex
						this.$store.dispatch('login', res).then(result => {
							return uni.switchTab({
								url: "../index/index"
							})
						})
					} else {
						this.handleRegOrLogin()
					}
				})
			}
		}
	}
</script>

<style>

</style>
