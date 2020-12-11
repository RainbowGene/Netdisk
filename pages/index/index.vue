<template>
	<view>
		<!-- 导航栏 -->
		<nav-bar>
			<template v-if="checkList.length===0">
				<template slot="left">
					<!-- current 存在表示在子目录 -->
					<view v-if="current" class="flex align-center justify-center bg-light rounded-circle ml-3 " style="width: 60rpx;height: 60rpx;"
					 hover-class="bg-hover-light" @tap="backDir">
						<text class="iconfont icon-fanhui"></text>
					</view>
					<text class="font-md ml-3">
						{{current?current.name:'首页'}}
					</text>
				</template>
				<template slot="right">
					<view class="flex align-center justify-center bg-light rounded-circle mr-3 " style="width: 60rpx;height: 60rpx;"
					 hover-class="bg-hover-light" @tap="openAdd">
						<text class="iconfont icon-zengjia"></text>
					</view>
					<view class="flex align-center justify-center bg-light rounded-circle mr-3" style="width: 60rpx;height: 60rpx;"
					 hover-class="bg-hover-light" @tap="openSort">
						<text class="iconfont icon-gengduo"></text>
					</view>
				</template>
			</template>
			<template v-else>
				<view slot="left" class="font-md ml-3 text-primary" @click="handleCheckAll(false)">取消</view>
				<text class="font-md font-weight-bold">已选中{{checkList.length}}个</text>
				<view slot="right" class="font-md mr-3 text-primary" @click="handleCheckAll(true)">全选</view>
			</template>
		</nav-bar>

		<!-- 搜索框 -->
		<view class="px-3 py-2">
			<view class="position-relative">
				<view class="position-absolute flex align-center justify-center" style="height: 70rpx;width: 70rpx;top: 0;left: 0;">
					<text class="iconfont icon-sousuo text-light-muted"></text>
				</view>
				<input type="text" value="" style="height: 70rpx;padding-left: 70rpx;" class="bg-light font-md rounded-circle"
				 placeholder="搜索当前目录文件" @input="search" />
			</view>
		</view>

		<!-- 列表项 -->
		<f-list v-for="(item,index) in list" :key="index" :item="item" :index="index" @click="doEvent(item)" @select="select"></f-list>

		<!-- 底部操作条 -->
		<view v-if="checkList.length>0">
			<view style="height: 115rpx;"></view>
			<view class="flex align-stretch bg-primary text-white fixed-bottom" style="height: 115rpx;line-height: 1.5;">
				<view v-for="(item,index) in actions" :key="index" class="flex-1 flex flex-column align-center justify-center"
				 hover-class="bg-hover-primary" @click="handleBottomEvent(item)">
					<text :class="'iconfont '+item.icon"></text>
					<text class="font-sm">{{item.name}}</text>
				</view>
			</view>
		</view>

		<!-- 删除弹出层 -->
		<f-dialog ref="delDialog" title="操作">是否删除选中项？</f-dialog>

		<!-- 重命名弹出层 -->
		<f-dialog ref="renDialog" title="操作">
			<input type="text" v-model="renameValue" class="bg-light rounded flex-1 px-2" style="height: 95rpx;" placeholder="新命名" />
		</f-dialog>

		<!-- 添加操作条 -->
		<uni-popup ref="addDialog" type="bottom">
			<view class="bg-white flex" style="height: 200rpx;">
				<view v-for="(item,index) in addList" :key="index" class="flex-1 flex align-center justify-center flex-column"
				 hover-class="bg-light" @tap="handleAddEvent(item)">
					<text :class="item.color+' '+item.icon" class="rounded-circle bg-light iconfont flex align-center justify-center"
					 style="width: 110rpx;height: 110rpx;"></text>
					<text class="font text-muted">{{item.name}}</text>
				</view>
			</view>
		</uni-popup>

		<!-- 新建文件夹弹出层 -->
		<f-dialog ref="dirDialog" title="新建文件夹">
			<input type="text" v-model="dirname" class="bg-light rounded flex-1 px-2" style="height: 95rpx;" placeholder="文件夹名称" />
		</f-dialog>

		<!-- 排序框 -->
		<uni-popup ref="sortDialog" type="bottom">
			<view class="bg-white">
				<view v-for="(item,index) in sortOptions" :key="index" class="flex align-center justify-center py-2 font border-bottom border-light-secondary"
				 :class="index===sortIndex?'text-main':'text-dark'" hover-class="bg-light" @click="changeSort(index)">
					{{item.name}}
				</view>
			</view>
		</uni-popup>

		<!-- h5 下载 -->
		<!-- #ifdef H5 -->
		<f-dialog ref="h5downDialog" title="下载确认">
			<view class="flex flex-column align-center">
				<text>检测到您是h5，请分别点击链接下载</text>
				<a :href="item.url" v-for="(item,index) in htmlDownUrl" :key="index" class="text-main">
					{{item.name}}
				</a>
			</view>
		</f-dialog>
		<!-- #endif -->
	</view>
</template>

<script>
	import navBar from "@/components/common/nav-bar.vue"
	import fList from "@/components/common/f-list.vue"
	import fDialog from "@/components/common/f-dialog.vue"
	import uniPopup from "@/components/uni-ui/uni-popup/uni-popup.vue"
	export default {
		components: {
			navBar,
			fList,
			fDialog,
			uniPopup
		},
		data() {
			return {
				list: [],
				dirs: [],
				htmlDownUrl: [], // h5 的下载链接
				renameValue: '',
				dirname: '',
				sortIndex: 0,
				sortOptions: [{
					name: '按名称排序',
					key: 'name'
				}, {
					name: '按时间排序',
					key: 'created_time'
				}],
				addList: [{
						icon: "icon-file-b-6",
						color: "text-success",
						name: "上传图片"
					},
					{
						icon: "icon-file-b-9",
						color: "text-primary",
						name: "上传视频"
					},
					{
						icon: "icon-file-b-8",
						color: "text-muted",
						name: "上传文件"
					},
					{
						icon: "icon-file-b-2",
						color: "text-warning",
						name: "新建文件夹"
					},
				]
			}
		},
		computed: {
			// 选中列表
			checkList() {
				return this.list.filter(item => item.checked);
			},
			// 底部菜单
			actions() {
				if (this.checkList.length > 1) {
					return [{
						icon: "icon-xiazai",
						name: "下载"
					}, {
						icon: "icon-shanchu",
						name: "删除"
					}]
				}
				return [{
					icon: "icon-xiazai",
					name: "下载"
				}, {
					icon: "icon-fenxiang-1",
					name: "分享"
				}, {
					icon: "icon-shanchu",
					name: "删除"
				}, {
					icon: "icon-chongmingming",
					name: "重命名"
				}]
			},
			file_id() { // 当前目录
				let l = this.dirs.length
				if (l === 0) return 0
				return this.dirs[l - 1].id
			},
			current() {
				let l = this.dirs.length
				if (l === 0) return false
				return this.dirs[l - 1]
			}
		},
		onLoad() {
			let dirs = uni.getStorageSync('dirs');
			if (dirs) this.dirs = JSON.parse(dirs); // 有上次的操作状态则获取
			this.getData();
		},
		methods: {
			// 获取当前用户网盘文件信息
			getData() {
				let orderby = this.sortOptions[this.sortIndex].key;
				this.$H.get(`/file?file_id=${this.file_id}&orderby=${orderby}`, {
					token: true
				}).then(res => {
					this.list = this.formatList(res)
				})
			},
			// 格式化对象数据
			formatList(list) {
				return list.map(item => {
					let type = "none"
					if (item.isdir === 1) {
						type = 'dir'
					} else {
						type = (item.ext.split('/'))[0] || 'none'
					}
					return {
						type,
						checked: false,
						...item
					}
				})
			},
			// 点击选择
			select(e) {
				this.list[e.index].checked = e.value;
			},
			// 全选/取消全选按钮
			handleCheckAll(check) {
				if (check) return this.list.forEach(item => item.checked = true);
				this.list.forEach(item => item.checked = false)
			},
			// 下载事件
			download() {
				this.checkList.forEach(item => {
					if (item.isdir === 0) { // 文件
						const key = this.getID(8)
						let obj = {
							name: item.name,
							type: item.type,
							size: item.size,
							key,
							progress: 0,
							status: true,
							created_time: (new Date).getTime()
						}
						// 创建下载任务
						this.$store.dispatch('createDownLoadJob', obj);
						let url = item.url;
						// #ifdef H5
						this.htmlDownUrl = this.checkList.map(item => {
							return {
								name: item.name,
								url: item.url
							}
						})
						this.$refs.h5downDialog.open(close => {
							console.log(this.htmlDownUrl);
						})
						// #endif
						// 下面代码不兼容h5
						// #ifndef H5
						let d = uni.downloadFile({
							url,
							success: (res) => {
								if (res.statusCode === 200) {
									// console.log('下载成功', res);
									// 将文件保存:下载返回的路径时临时路径
									uni.saveFile({
										tempFilePath: item.tempFilePath
									})
								}
							}
						})

						// 下载进度
						d.onProgressUpdate((res) => {
							this.$store.dispatch('updateUploadJob', {
								progress: res.progress,
								status: true,
								key
							})
						})
						// #endif
					}
				})

				uni.showToast({
					title: '已加入下载任务',
					icon: 'none'
				});
				// 取消选中
				this.handleCheckAll(false)
			},
			// 底部操作栏事件
			handleBottomEvent(e) {
				switch (e.name) {
					case '删除':
						this.$refs.delDialog.open((close) => {
							uni.showLoading({
								title: '正在删除...',
								mask: false
							})
							let ids = (this.checkList.map(item => item.id)).join(',')
							this.$H.post('/file/delete', {
								ids
							}, {
								token: true
							}).then(res => {
								this.getData();
								uni.showToast({
									title: '删除成功!',
									icon: 'none'
								});
								uni.hideLoading()
							}).catch(err => {
								uni.hideLoading()
							})
							close()
						})
						break;
					case '重命名':
						this.renameValue = this.checkList[0].name;
						this.$refs.renDialog.open((close) => {
							if (this.renameValue == '') {
								return uni.showToast({
									title: '无效的文件名',
									icon: "none"
								})
							}
							this.$H.post('/file/rename', {
								id: this.checkList[0].id,
								name: this.renameValue
							}, {
								token: true
							}).then(res => {
								this.checkList[0].name = this.renameValue;
								uni.showToast({
									title: '命名成功!',
									icon: 'none'
								});
							})
							close();
						})
						break;
					case '分享':

						break;
					case '下载':
						this.download()
						break;
				}
			},
			// 右上角添加按钮
			openAdd() {
				this.$refs.addDialog.open()
			},
			// 上传图片/文件
			upload(file, type) {
				const key = this.getID(8)
				let obj = {
					name: file.name,
					type,
					size: file.size,
					key,
					progress: 0,
					status: true,
					created_time: (new Date).getTime()
				};
				// 创建上传任务
				this.$store.dispatch('createUploadJob', obj)
				// 上传
				console.log(this.file_id);
				this.$H.upload(`/upload?file_id=${this.file_id}`, {
					filePath: file.path
				}, (p) => { // p:进度
					// 更新任务进度
					this.$store.dispatch('updateUploadJob', {
						states: true,
						progress: p,
						key
					})
				}).then(res => {
					this.getData()
				})
			},
			// 生成唯一id
			getID(length) {
				return Number(Math.random().toString().substr(3, length) + Date.now().toString(36))
			},
			// 底部弹出操作框 
			handleAddEvent(e) {
				this.$refs.addDialog.close();
				switch (e.name) {
					case '上传图片':
						uni.chooseImage({
							count: 9,
							success: (res) => {
								res.tempFiles.forEach(item => {
									this.upload(item, 'image')
								})
							}
						})
						break;
					case '上传视频':
						uni.chooseVideo({
							count: 1,
							success: (res) => {
								let name = '',
									size = 0
								// #ifndef H5
								name = res.tempFilePath.substring(res.tempFilePath.lastIndexOf('/') + 1)
								// #endif
								this.upload({
									path: res.tempFilePath,
									name,
									type: 'video',
									size
								})
							}
						})
						break;
					case '上传文件':

						break;
					case '新建文件夹':
						this.$refs.dirDialog.open(close => {
							if (this.dirname == '') {
								return uni.showToast({
									title: '无效的命名',
									icon: "none"
								})
							}
							// 请求服务器：创建
							this.$H.post('/file/createdir', {
								file_id: this.file_id,
								name: this.dirname
							}, {
								token: true
							}).then(res => {
								this.getData();
								uni.showToast({
									title: '新建成功!',
									icon: 'none'
								});
							})
							close();
							this.dirname = ''
						})
						break;
				}
			},
			// 列表点击事件
			doEvent(e) {
				switch (e.type) {
					case 'image':
						// 预览图片
						let images = this.list.filter(item => item.type === 'image');
						uni.previewImage({
							current: e.url,
							urls: images.map(item => item.url)
						});
						break;
					case 'video':
						// 视频播放
						uni.navigateTo({
							url: "../video/video?url=" + e.url + "&title=" + e.name
						})
						break;
					default: // 文件夹
						this.dirs.push({
							id: e.id,
							name: e.name
						})
						this.getData()
						// 储存
						uni.setStorage({
							key: "dirs",
							data: JSON.stringify(this.dirs)
						})
						break;
				}
			},
			// 更多：排序
			openSort() {
				this.$refs.sortDialog.open()
			},
			// 切换排序方法
			changeSort(index) {
				this.sortIndex = index
				this.getData();
				this.$refs.sortDialog.close()
			},
			// 返回上级目录
			backDir() {
				this.dirs.pop();
				this.getData();
				uni.setStorage({
					key: "dirs",
					data: JSON.stringify(this.dirs)
				});
			},
			// 搜索框变化
			search(e) {
				if (e.detail.value === '') return this.getData();
				this.$H.get(`/file/search?keyword=${e.detail.value}`, {
					token: true
				}).then(res => {
					this.list = this.formatList(res.rows)
				})
			}
		}
	}
</script>

<style>

</style>
