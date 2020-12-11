<template>
	<view style="height: 100vh;" class="flex flex-column">
		<view class="flex border-bottom border-light-secondary" style="height: 100rpx;">
			<view v-for="(item,index) in tabBars" :key="index" class="flex-1 flex flex-column align-center justify-center"
			 :class="index===tabIndex?'text-main':''" @click="changeTab(index)">
				<text class="font-md">{{item.name}}</text>
				<text style="width: 30rpx;height: 8rpx;" class="rounded" :class="index === tabIndex?'bg-main':''"></text>
			</view>
		</view>

		<swiper :duration="250" class="flex-1 flex" :current="tabIndex" @change="changeTab($event.detail.current)">
			<swiper-item class="flex-1 flex" v-for="(item,index) in tabBars" :key="index">
				<scroll-view scroll-y="true" class="flex-1">
					<template v-if="index===0">
						<view class="bg-light flex align-center font-sm px-2 text-muted" style="height: 60rpx;">
							文件下载至：xxx/xxx/x/xx/xx
						</view>
						<view class="p-2 border-bottom border-light-secondary font-sm">
							下载中({{downing.length}})
						</view>
						<!-- 列表项 -->
						<f-list v-for="(item,index) in downing" :key="'a'+index" :item="item" :index="index">
							<view class="flex align-center text-main" style="height: 70rpx;">
								<text class="iconfont icon-zanting"></text>
								<text class="ml-1">{{item.progress}}%</text>
							</view>
							<progress slot="bottom" :percent="item.progress" stroke-width="4" activeColor="#009CFF" />
						</f-list>
						<view class="p-2 border-bottom border-light-secondary font-sm">
							下载完成({{downed.length}})
						</view>
						<!-- 列表项 -->
						<f-list v-for="(item,index) in downed" :showRight="false" :key="'b'+index" :item="item" :index="index"></f-list>
					</template>
					<!-- 上传列表 -->
					<template v-else>
						<view class="p-2 border-bottom border-light-secondary font-sm">
							上传中({{uploading.length}})
						</view>
						<!-- 列表项 -->
						<f-list v-for="(item,index) in uploading" :key="'a'+index" :item="item" :index="index">
							<view class="flex align-center text-main" style="height: 70rpx;">
								<text class="iconfont icon-zanting"></text>
								<text class="ml-1">{{item.progress}}%</text>
							</view>
							<progress slot="bottom" :percent="item.progress" stroke-width="4" activeColor="#009CFF" />
						</f-list>
						<view class="p-2 border-bottom border-light-secondary font-sm">
							上传完成({{uploaded.length}})
						</view>
						<!-- 列表项 -->
						<f-list v-for="(item,index) in uploaded" :showRight="false" :key="'b'+index" :item="item" :index="index"></f-list>
					</template>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import fList from "@/components/common/f-list.vue"
	import {
		mapState
	} from "vuex" // 监听上传/下载进度
	export default {
		components: {
			fList
		},
		data() {
			return {
				tabIndex: 0,
				tabBars: [{
						name: '下载列表'
					},
					{
						name: '上传列表'
					}
				],

			}
		},
		computed: {
			...mapState({
				uploadList: state => state.uploadList,
				downList: state => state.downList
			}),
			// 上传中
			uploading() {
				return this.uploadList.filter(item => item.progress < 100)
			},
			// 上传完成
			uploaded() {
				return this.uploadList.filter(item => item.progress === 100)
			},
			// 下载中
			downing() {
				return this.downList.filter(item => item.progress < 100)
			},
			// 下载完成
			downed() {
				return this.downList.filter(item => item.progress === 100)
			}
		},
		onLoad() {
			this.$store.dispatch('initList')
		},
		methods: {
			// 选项卡选择 联动 swiper滑动组件
			changeTab(index) {
				this.tabIndex = index
			}
		}
	}
</script>

<style>

</style>
