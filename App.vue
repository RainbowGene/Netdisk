<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')

			this.$store.dispatch('initUser') // 初始化用户信息
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("/common/css/uni.css");
	@import url("/common/css/common.css");
	@import url("/common/css/free.css");
	@import url("/common/css/icon.css");
</style>
