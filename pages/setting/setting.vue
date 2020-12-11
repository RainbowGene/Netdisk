<template>
	<view>
		<view class="mx-3 mt-4 bg-main text-white flex align-center justify-center font-lg rounded-circle" hover-class="bg-main-hover"
		 @click="logout">
			退出登录
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			logout() {
				this.$store.dispatch('logout').then(res => {
					uni.showToast({
						title: '成功退出',
						icon: 'none'
					});
				})
			}
		}
	}
</script>

<style>

</style>
