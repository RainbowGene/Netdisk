<template>
	<!-- 列表项 -->
	<view class="p-3 flex align-center border-bottom border-light-secondary">
		<text class="iconfont" :class="iconClass" style="font-size:60rpx;"></text>
		<view class="flex flex-column ml-3" style="line-height: 1.2;">
			<text class="font-md mb-1">{{item.name}}</text>
			<text class="font-sm text-muted">{{item.create_time}}</text>
		</view>
		<view class="ml-auto flex align-center justify-center" style="width: 70rpx;height: 70rpx;" @click.stop="select">
			<text v-if="!item.checked" class="rounded-circle border" style="width: 25rpx;height: 25rpx;"></text>
			<text v-else class="iconfont icon-xuanze-yixuan text-primary" style="font-size: 35rpx;"></text>
		</view>
	</view>
</template>

<script>
	const icons = {
		dir: {
			value: "icon-file-b-2",
			color: 'text-warning'
		},
		image: {
			value: "icon-file-b-6",
			color: 'text-success'
		},
		video: {
			value: "icon-file-b-9",
			color: 'text-primary'
		},
		text: {
			value: "icon-file-b-7",
			color: 'text-info'
		},
		none: {
			value: "icon-file-b-8",
			color: 'text-muted'
		},
	};
	export default {
		props: {
			item: Object,
			index: [Number, String]
		},
		computed: {
			iconClass() {
				let type = icons[this.item.type]
				return `${type.value} ${type.color}`
			}
		},
		methods: {
			select() {
				this.$emit("select", {
					index: this.index,
					value: !this.item.checked
				})
			}
		}
	}
</script>

<style>
</style>
