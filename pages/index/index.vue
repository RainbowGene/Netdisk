<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar>
			<text slot="left" class="font-md ml-3">首页</text>
			<template slot="right">
				<view class="flex align-center justify-center bg-light rounded-circle mr-3 " style="width: 60rpx;height: 60rpx;">
					<text class="iconfont icon-zengjia"></text>
				</view>
				<view class="flex align-center justify-center bg-light rounded-circle mr-3" style="width: 60rpx;height: 60rpx;">
					<text class="iconfont icon-gengduo"></text>
				</view>
			</template>
		</nav-bar>

		<!-- 搜索框 -->
		<view class="px-3 py-2">
			<view class="position-relative">
				<view class="position-absolute flex align-center justify-center" style="height: 70rpx;width: 70rpx;top: 0;left: 0;">
					<text class="iconfont icon-sousuo text-light-muted"></text>
				</view>
				<input type="text" value="" style="height: 70rpx;padding-left: 70rpx;" class="bg-light font-md rounded-circle"
				 placeholder="搜索网盘文件" />
			</view>
		</view>

		<!-- 列表项 -->
		<f-list v-for="(item,index) in list" :key="index" :item="item" :index="index" @select="select"></f-list>
	</view>
</template>

<script>
	import navBar from "@/components/common/nav-bar.vue"
	import fList from "@/components/common/f-list.vue"
	export default {
		components: {
			navBar,
			fList
		},
		data() {
			return {
				list: [{
					type: "dir",
					name: "我的笔记",
					create_time: "2019-10-31 08:00",
					checked: false
				}, {
					type: "image",
					name: "风景.jpg",
					create_time: "2019-10-31 08:00",
					checked: false
				}, {
					type: "video",
					name: "这是一个视频.mp4",
					create_time: "2019-10-31 08:00",
					checked: false
				}, {
					type: "text",
					name: "记事本.txt",
					create_time: "2019-10-31 08:00",
					checked: false
				}, ]
			}
		},
		onLoad() {

		},
		methods: {
			// 点击选择
			select(e) {
				this.list[e.index].checked = e.value;
			}
		}
	}
</script>

<style>

</style>
