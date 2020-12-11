<template>
	<uni-popup ref="dialog">
		<view style="width: 450rpx;" class="bg-white rounded">
			<view class="flex align-center justify-center font-weight-bold border-bottom border-light-secondary" style="height: 80rpx;">
				{{title}}
			</view>
			<view class="flex align-center justify-center p-2">
				<slot></slot>
			</view>
			<view class="flex border-top border-light-secondary" style="height: 80rpx;">
				<view class="flex-1 text-muted flex align-center justify-center" @tap="cancel">
					{{cancelText}}
				</view>
				<view class="flex-1 text-primary flex align-center justify-center" @tap="confirm">
					{{confirmText}}
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import uniPopup from "@/components/uni-ui/uni-popup/uni-popup.vue"
	export default {
		components: {
			uniPopup
		},
		props: {
			title: {
				type: String,
				default: '提示'
			},
			cancelText: {
				type: String,
				default: '取消'
			},
			confirmText: {
				type: String,
				default: '确定'
			}
		},
		data() {
			return {
				callback: null
			}
		},
		methods: {
			open(callback = false) {
				this.callback = callback
				this.$refs.dialog.open()
			},
			confirm() {
				if (typeof this.callback === 'function') {
					this.callback(() => {
						this.cancel()
					})
				} else {
					this.$emit('confirm')
					this.cancel()
				}
			},
			cancel() {
				this.$emit('cancel')
				this.$refs.dialog.close()
			}
		}
	}
</script>

<style>
</style>
